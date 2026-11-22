import {Router} from "express";
import {stripeSignatureValid,planPrice} from "./domain.mjs";
import {db} from "./auth.mjs";
import {wrap,verifyToken,required,HttpError} from "./security.mjs";

const api=Router();
const users=db.collection("users"),payments=db.collection("payments");
const stripeKey=()=>process.env.STRIPE_SECRET_KEY;
const clientOrigin=()=>String(process.env.CLIENT_URL||"http://localhost:3000").split(",")[0].replace(/\/$/,"");

async function stripeRequest(path,options={}){
 if(!stripeKey())throw new HttpError(503,"Stripe is not configured. Add STRIPE_SECRET_KEY to server/.env");
 const response=await fetch("https://api.stripe.com/v1"+path,{...options,headers:{Authorization:`Bearer ${stripeKey()}`,...options.headers},signal:AbortSignal.timeout(15000)});
 const json=await response.json();if(!response.ok)throw new HttpError(502,json?.error?.message || "Stripe request failed");return json;
}

async function fulfillPaidSession(session){
 if(session.payment_status!=="paid" || session.mode!=="payment")return false;
 const email=String(session.metadata?.userEmail||"").toLowerCase();
 if(!email || session.metadata?.plan!=="pro")return false;
 const user=await users.findOne({email});if(!user)return false;
 const amount=planPrice(user.role);
 if(session.amount_total!==amount || (session.currency||"").toLowerCase()!=="usd" || session.client_reference_id!==String(user._id))return false;
 await users.updateOne({_id:user._id},{$set:{plan:"pro"}});
 await payments.updateOne({stripeSessionId:session.id},{$setOnInsert:{userEmail:email,userName:user.name,userRole:user.role,planName:"Pro",amount:amount/100,currency:"usd",transactionId:String(session.payment_intent||session.id),stripeSessionId:session.id,paymentStatus:"paid",paidAt:new Date()}},{upsert:true});
 return true;
}

export function stripeWebhookHandler(){return async(req,res)=>{
 const secret=process.env.STRIPE_WEBHOOK_SECRET,signature=req.headers["stripe-signature"];
 if(!secret || typeof signature!=="string" || !Buffer.isBuffer(req.body))return res.status(400).json({message:"Invalid webhook configuration"});
 if(!stripeSignatureValid(req.body,signature,secret))return res.status(400).json({message:"Signature verification failed"});
 try{
  const event=JSON.parse(req.body.toString("utf8"));
  if(event.type==="checkout.session.completed" || event.type==="checkout.session.async_payment_succeeded")await fulfillPaidSession(event.data.object);
  return res.json({received:true});
 }catch(error){console.error("Stripe webhook processing:",error.message);return res.status(500).json({message:"Webhook processing error"});}
};}

api.use(verifyToken);
api.post("/payments/checkout",wrap(async(req,res)=>{
 const user=req.user;if(!["student","tutor"].includes(user.role))throw new HttpError(403,"Available for students and tutors");
 if(user.plan==="pro")throw new HttpError(409,"Account already has a Pro plan");
 const price=planPrice(user.role);const params=new URLSearchParams();
 const fields={mode:"payment",success_url:`${clientOrigin()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${clientOrigin()}/payment/cancel`,customer_email:user.email,client_reference_id:String(user._id),"metadata[userEmail]":user.email,"metadata[plan]":"pro","line_items[0][price_data][currency]":"usd","line_items[0][price_data][unit_amount]":String(price),"line_items[0][price_data][product_data][name]":`MentorLagbe Pro — ${user.role==="tutor"?"Tutor":"Student"}`,"line_items[0][quantity]":"1"};
 for(const [k,v] of Object.entries(fields))params.append(k,v);
 const session=await stripeRequest("/checkout/sessions",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:params});
 res.json({url:session.url,id:session.id});
}));
api.get("/payments/status",wrap(async(req,res)=>{
 const id=String(req.query.session_id||"");if(!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id))throw new HttpError(400,"Invalid checkout session");
 const session=await stripeRequest("/checkout/sessions/"+encodeURIComponent(id));
 if(session.client_reference_id!==String(req.user._id))throw new HttpError(403,"Not your checkout session");
 if(session.payment_status==="paid")await fulfillPaidSession(session);
 res.json({paid:session.payment_status==="paid",status:session.payment_status});
}));
api.post("/media/upload",wrap(async(req,res)=>{
 if(!process.env.IMGBB_API_KEY)throw new HttpError(503,"ImgBB is not configured. Add IMGBB_API_KEY in server/.env");
 const input=required(req.body?.data,"Image data",8_000_000);
 const match=input.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
 if(!match)throw new HttpError(400,"Choose a PNG, JPG or WebP image");
 const buffer=Buffer.from(match[2],"base64");if(buffer.length<20 || buffer.length>4*1024*1024)throw new HttpError(413,"Image must be between 20 bytes and 4 MB");
 const isPng=buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const isJpg=buffer[0]===0xff && buffer[1]===0xd8 && buffer[2]===0xff;
 const isWebp=buffer.toString("ascii",0,4)==="RIFF" && buffer.toString("ascii",8,12)==="WEBP";
 if(!(isPng||isJpg||isWebp))throw new HttpError(400,"Image content is invalid");
 const params=new URLSearchParams({image:match[2]});
 const response=await fetch("https://api.imgbb.com/1/upload?key="+encodeURIComponent(process.env.IMGBB_API_KEY),{method:"POST",body:params,signal:AbortSignal.timeout(20000)});
 const body=await response.json();if(!response.ok || !body.success || !/^https:\/\//.test(body.data?.url||""))throw new HttpError(502,"Image upload failed");
 res.json({url:body.data.url});
}));
export default api;
