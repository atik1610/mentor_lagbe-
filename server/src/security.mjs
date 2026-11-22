import {ObjectId} from "mongodb";
import {createRemoteJWKSet,jwtVerify} from "jose";
import {db,authDb,ensureProfile} from "./auth.mjs";

const baseURL=process.env.BETTER_AUTH_URL || "http://localhost:5000";
const jwks=createRemoteJWKSet(new URL(baseURL.replace(/\/$/,"")+"/api/auth/jwks"),{cooldownDuration:15000});
export class HttpError extends Error {constructor(status,message){super(message);this.status=status;}}
export const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export function objectId(raw){if(!ObjectId.isValid(String(raw)))throw new HttpError(400,"Invalid id");return new ObjectId(String(raw));}
export function text(value,max=500){return typeof value==="string"?value.trim().slice(0,max):"";}
export function positive(value){const n=Number(value);if(!Number.isFinite(n)||n<=0)throw new HttpError(400,"Enter a valid positive amount");return n;}
export function required(value,label,max=500){const s=text(value,max);if(!s)throw new HttpError(400,`${label} is required`);return s;}
const accountById=async id=>{
 if(!id)return null;
 if(ObjectId.isValid(id))return authDb.collection("user").findOne({_id:new ObjectId(id)});
 return authDb.collection("user").findOne({id});
};
export const verifyToken=wrap(async(req,res,next)=>{
 const match=/^Bearer\s+(\S+)$/i.exec(req.headers.authorization||"");
 if(!match)throw new HttpError(401,"Sign in and provide an access token");
 let payload;
 try{({payload}=await jwtVerify(match[1],jwks,{issuer:baseURL,audience:baseURL}));}
 catch{throw new HttpError(401,"Invalid or expired access token");}
 const authUser=await accountById(String(payload.sub||""));
 if(!authUser)throw new HttpError(401,"Account no longer exists");
 const user=await ensureProfile(authUser);
 if(!user)throw new HttpError(401,"Profile unavailable");
 req.user={...user,id:String(user._id)};
 req.authUser=authUser;
 next();
});
export const requireRole=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():next(new HttpError(403,"You do not have permission for this action"));
export const verifyStudent=requireRole("student");
export const verifyTutor=requireRole("tutor");
export const verifyAdmin=requireRole("admin");
export const profileOutput=user=>({id:String(user._id),name:user.name,email:user.email,role:user.role,plan:user.plan,phone:user.phone||"",bio:user.bio||"",image:user.image||"",savedTuitionIds:user.savedTuitionIds||[],createdAt:user.createdAt});
