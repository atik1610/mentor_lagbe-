import {Router} from "express";
import {db,authDb} from "./auth.mjs";
import {wrap,verifyToken,verifyStudent,verifyTutor,verifyAdmin,objectId,text,required,positive,HttpError,profileOutput} from "./security.mjs";
import {ObjectId} from "mongodb";
import {tuitionInput,safeRegex} from "./domain.mjs";

const api=Router();
const users=db.collection("users"),tuitions=db.collection("tuitions"),applications=db.collection("applications"),payments=db.collection("payments");
const statuses=["pending","approved","rejected"];
const dto=doc=>doc?{...doc,_id:String(doc._id),id:String(doc._id)}:null;
const list=docs=>docs.map(dto);
const publicQuery={approvalStatus:"approved",isActive:true};

api.get("/featured",wrap(async(req,res)=>res.json({items:list(await tuitions.find(publicQuery).sort({createdAt:-1}).limit(6).toArray())})));
api.get("/meta",wrap(async(req,res)=>{
 const [active,students,tutors,subjects]=await Promise.all([
  tuitions.countDocuments(publicQuery),users.countDocuments({role:"student"}),users.countDocuments({role:"tutor"}),
  tuitions.aggregate([{$match:publicQuery},{$group:{_id:"$subject",count:{$sum:1}}},{$sort:{count:-1}},{$limit:8}]).toArray()]);
 res.json({activeListings:active,students,tutors,subjects:subjects.map(x=>({name:x._id,count:x.count}))});
}));
api.get("/tuitions",wrap(async(req,res)=>{
 const filter={...publicQuery},search=text(req.query.search,120),subject=text(req.query.subject,80),classLevel=text(req.query.classLevel,80),mode=text(req.query.mode,10);
 if(search)filter.$or=[{title:{$regex:safeRegex(search),$options:"i"}},{subject:{$regex:safeRegex(search),$options:"i"}}];
 if(subject)filter.subject=subject;if(classLevel)filter.classLevel=classLevel;if(["Online","Offline"].includes(mode))filter.mode=mode;
 const page=Math.max(1,Math.min(Number.parseInt(req.query.page)||1,10000));const limit=Math.max(1,Math.min(Number.parseInt(req.query.limit)||9,30));
 const [count,items]=await Promise.all([tuitions.countDocuments(filter),tuitions.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).toArray()]);
 res.json({items:list(items),total:count,page,limit,pages:Math.max(1,Math.ceil(count/limit))});
}));
api.get("/tuitions/:id",wrap(async(req,res)=>{
 const tuition=await tuitions.findOne({_id:objectId(req.params.id),...publicQuery});
 if(!tuition)throw new HttpError(404,"Tuition not found");
 const tutor=await users.findOne({email:tuition.tutorEmail},{projection:{_id:0,name:1,image:1,bio:1,role:1,plan:1}});
 res.json({tuition:dto(tuition),tutor:tutor||null});
}));
api.use(verifyToken);
api.get("/me",wrap(async(req,res)=>res.json({user:profileOutput(req.user)})));
api.patch("/me",wrap(async(req,res)=>{
 const fields={};if(Object.hasOwn(req.body||{},"name"))fields.name=required(req.body.name,"Name",100);
 if(Object.hasOwn(req.body||{},"phone"))fields.phone=text(req.body.phone,32);
 if(Object.hasOwn(req.body||{},"bio"))fields.bio=text(req.body.bio,700);
 if(Object.hasOwn(req.body||{},"image")){
  const image=text(req.body.image,700);
  if(image && !/^https:\/\//i.test(image))throw new HttpError(400,"Image must be an HTTPS URL");
  fields.image=image;
 }
 if(!Object.keys(fields).length)throw new HttpError(400,"No profile fields to update");
 await users.updateOne({_id:req.user._id},{$set:fields});
 const authFields={};if(fields.name)authFields.name=fields.name;if(fields.image!==undefined)authFields.image=fields.image;
 if(Object.keys(authFields).length)await authDb.collection("user").updateOne({_id:req.authUser._id},{$set:authFields});
 res.json({user:profileOutput(await users.findOne({_id:req.user._id})),message:"Profile updated"});
}));

// Student-controlled application and saved listings; only server-derived identity is trusted.
api.post("/tuitions/:id/apply",verifyStudent,wrap(async(req,res)=>{
 const tuition=await tuitions.findOne({_id:objectId(req.params.id),...publicQuery});if(!tuition)throw new HttpError(404,"This tuition is unavailable");
 const studentPhone=required(req.body.studentPhone,"Phone",35),preferredSchedule=required(req.body.preferredSchedule,"Preferred schedule",200);
 if(!/^[+0-9 ()-]{7,35}$/.test(studentPhone))throw new HttpError(400,"Enter a valid phone number");
 const doc={tuitionId:tuition._id,tuitionTitle:tuition.title,subject:tuition.subject,monthlyFee:tuition.monthlyFee,tutorEmail:tuition.tutorEmail,tutorName:tuition.tutorName,studentName:req.user.name,studentEmail:req.user.email,studentPhone,preferredSchedule,studentNote:text(req.body.studentNote,800),status:"pending",appliedAt:new Date()};
 try{const result=await applications.insertOne(doc);res.status(201).json({application:dto({...doc,_id:result.insertedId}),message:"Application submitted"});}
 catch(error){if(error.code===11000)throw new HttpError(409,"You already applied to this tuition");throw error;}
}));
api.get("/student/applications",verifyStudent,wrap(async(req,res)=>res.json({items:list(await applications.find({studentEmail:req.user.email}).sort({appliedAt:-1}).toArray())})));
api.delete("/student/applications/:id",verifyStudent,wrap(async(req,res)=>{
 const result=await applications.deleteOne({_id:objectId(req.params.id),studentEmail:req.user.email,status:"pending"});
 if(!result.deletedCount)throw new HttpError(409,"Application not found or no longer pending");res.json({message:"Pending application cancelled"});
}));
api.get("/student/saved",verifyStudent,wrap(async(req,res)=>{
 const ids=(req.user.savedTuitionIds||[]).map(x=>{try{return objectId(x);}catch{return null;}}).filter(Boolean);
 res.json({items:list(await tuitions.find({_id:{$in:ids},...publicQuery}).toArray())});
}));
api.post("/student/saved/:id",verifyStudent,wrap(async(req,res)=>{
 const id=String(objectId(req.params.id));
 if(!await tuitions.findOne({_id:new ObjectId(id),...publicQuery}))throw new HttpError(404,"Tuition unavailable");
 await users.updateOne({_id:req.user._id},{$addToSet:{savedTuitionIds:id}});res.json({message:"Tuition saved"});
}));
api.delete("/student/saved/:id",verifyStudent,wrap(async(req,res)=>{
 await users.updateOne({_id:req.user._id},{$pull:{savedTuitionIds:String(objectId(req.params.id))}});res.json({message:"Removed from saved tuitions"});
}));
api.post("/tuitions/:id/reviews",verifyStudent,wrap(async(req,res)=>{
 const tuitionId=objectId(req.params.id);const approved=await applications.findOne({tuitionId,studentEmail:req.user.email,status:"accepted"});
 if(!approved)throw new HttpError(403,"Only accepted students can review this tuition");
 const rating=Number(req.body.rating);if(!Number.isInteger(rating)||rating<1||rating>5)throw new HttpError(400,"Rating must be 1–5");
 const review={studentEmail:req.user.email,studentName:req.user.name,rating,comment:required(req.body.comment,"Feedback",700),createdAt:new Date()};
 const changed=await tuitions.updateOne({_id:tuitionId,"reviews.studentEmail":{$ne:req.user.email}},{$push:{reviews:review}});
 if(!changed.modifiedCount)throw new HttpError(409,"Already reviewed, or tuition unavailable");res.status(201).json({message:"Review submitted"});
}));

// Tutors: ownership checks are mandatory on every mutating operation.
api.get("/tutor/tuitions",verifyTutor,wrap(async(req,res)=>res.json({items:list(await tuitions.find({tutorEmail:req.user.email}).sort({createdAt:-1}).toArray())})));
api.post("/tuitions",verifyTutor,wrap(async(req,res)=>{
 const data=tuitionInput(req.body);
 if(req.user.plan!=="pro" && await tuitions.countDocuments({tutorEmail:req.user.email})>=2)throw new HttpError(403,"Free tutors can post only two tuitions. Upgrade to Pro for unlimited posts.");
 const doc={...data,tutorName:req.user.name,tutorEmail:req.user.email,approvalStatus:"pending",isActive:true,createdAt:new Date(),reviews:[]};
 const inserted=await tuitions.insertOne(doc);res.status(201).json({tuition:dto({...doc,_id:inserted.insertedId}),message:"Post submitted for admin approval"});
}));
api.patch("/tuitions/:id",verifyTutor,wrap(async(req,res)=>{
 const doc=tuitionInput(req.body);
 const result=await tuitions.updateOne({_id:objectId(req.params.id),tutorEmail:req.user.email},{$set:{...doc,approvalStatus:"pending",updatedAt:new Date()}});
 if(!result.matchedCount)throw new HttpError(404,"Own tuition not found");res.json({message:"Updated. Pending admin review."});
}));
api.patch("/tuitions/:id/toggle",verifyTutor,wrap(async(req,res)=>{
 if(typeof req.body.isActive!=="boolean")throw new HttpError(400,"isActive must be boolean");
 const result=await tuitions.updateOne({_id:objectId(req.params.id),tutorEmail:req.user.email},{$set:{isActive:req.body.isActive}});
 if(!result.matchedCount)throw new HttpError(404,"Own tuition not found");res.json({message:req.body.isActive?"Tuition reopened":"Tuition closed"});
}));
api.delete("/tuitions/:id",verifyTutor,wrap(async(req,res)=>{
 const result=await tuitions.deleteOne({_id:objectId(req.params.id),tutorEmail:req.user.email});
 if(!result.deletedCount)throw new HttpError(404,"Own tuition not found");res.json({message:"Tuition deleted"});
}));
api.get("/tutor/applicants",verifyTutor,wrap(async(req,res)=>{
 const docs=await applications.aggregate([{$match:{tutorEmail:req.user.email}},{$lookup:{from:"users",localField:"studentEmail",foreignField:"email",as:"matchedStudent"}},{$addFields:{studentPlan:{$ifNull:[{$arrayElemAt:["$matchedStudent.plan",0]},"free"]}}},{$project:{matchedStudent:0}},{$sort:{studentPlan:-1,appliedAt:-1}}]).toArray();
 res.json({items:list(docs)});
}));
api.patch("/tutor/applicants/:id",verifyTutor,wrap(async(req,res)=>{
 if(!["accepted","rejected"].includes(req.body.status))throw new HttpError(400,"Choose Accepted or Rejected");
 const result=await applications.updateOne({_id:objectId(req.params.id),tutorEmail:req.user.email,status:"pending"},{$set:{status:req.body.status,reviewedAt:new Date()}});
 if(!result.modifiedCount)throw new HttpError(409,"Application not found or already decided");res.json({message:`Application ${req.body.status}`});
}));

// Role dashboards
api.get("/student/stats",verifyStudent,wrap(async(req,res)=>{
 const [total,accepted,pending]=await Promise.all([applications.countDocuments({studentEmail:req.user.email}),applications.countDocuments({studentEmail:req.user.email,status:"accepted"}),applications.countDocuments({studentEmail:req.user.email,status:"pending"})]);
 res.json({totalApplied:total,accepted,pending,plan:req.user.plan});
}));
api.get("/tutor/stats",verifyTutor,wrap(async(req,res)=>{
 const [total,approved,active,applicants]=await Promise.all([tuitions.countDocuments({tutorEmail:req.user.email}),tuitions.countDocuments({tutorEmail:req.user.email,approvalStatus:"approved"}),tuitions.countDocuments({tutorEmail:req.user.email,...publicQuery}),applications.countDocuments({tutorEmail:req.user.email})]);
 res.json({total,approved,active,applicants,plan:req.user.plan});
}));
api.get("/admin/stats",verifyAdmin,wrap(async(req,res)=>{
 const [totalUsers,totalTutors,pending,approved,revenue]=await Promise.all([users.countDocuments(),users.countDocuments({role:"tutor"}),tuitions.countDocuments({approvalStatus:"pending"}),tuitions.countDocuments({approvalStatus:"approved"}),payments.aggregate([{$match:{paymentStatus:"paid"}},{$group:{_id:null,total:{$sum:"$amount"}}}]).toArray()]);
 res.json({totalUsers,totalTutors,pending,approved,revenue:revenue[0]?.total||0});
}));
api.get("/admin/users",verifyAdmin,wrap(async(req,res)=>res.json({items:list(await users.find({},{projection:{name:1,email:1,role:1,plan:1,image:1,createdAt:1}}).sort({createdAt:-1}).toArray())})));
api.patch("/admin/users/:id/role",verifyAdmin,wrap(async(req,res)=>{
 if(!["student","tutor","admin"].includes(req.body.role))throw new HttpError(400,"Invalid role");
 const id=objectId(req.params.id),user=await users.findOne({_id:id});if(!user)throw new HttpError(404,"User not found");
 if(String(id)===String(req.user._id) && req.body.role!=="admin")throw new HttpError(403,"You cannot remove your own admin access");
 await users.updateOne({_id:id},{$set:{role:req.body.role}});
 await authDb.collection("user").updateOne({email:user.email},{$set:{role:req.body.role}});
 res.json({message:"Role updated"});
}));
api.get("/admin/tuitions",verifyAdmin,wrap(async(req,res)=>res.json({items:list(await tuitions.find().sort({createdAt:-1}).toArray())})));
api.patch("/admin/tuitions/:id/approval",verifyAdmin,wrap(async(req,res)=>{
 if(!["approved","rejected"].includes(req.body.approvalStatus))throw new HttpError(400,"Choose approved or rejected");
 const result=await tuitions.updateOne({_id:objectId(req.params.id)},{$set:{approvalStatus:req.body.approvalStatus,reviewedAt:new Date()}});
 if(!result.matchedCount)throw new HttpError(404,"Tuition not found");res.json({message:`Tuition ${req.body.approvalStatus}`});
}));
api.get("/admin/transactions",verifyAdmin,wrap(async(req,res)=>res.json({items:list(await payments.find().sort({paidAt:-1}).toArray())})));
export default api;
