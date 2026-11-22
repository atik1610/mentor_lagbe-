import "dotenv/config";
import {MongoClient} from "mongodb";
import {betterAuth} from "better-auth";
import {mongodbAdapter} from "@better-auth/mongo-adapter";
import {jwt} from "better-auth/plugins";
import {createAuthMiddleware, APIError} from "better-auth/api";
import {validatePublicRole} from "./domain.mjs";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be configured");
if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");

export const mongoClient=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:12});
await mongoClient.connect();
export const db=mongoClient.db(process.env.MONGODB_DB_NAME || "mentorlagbe");
export const authDb=mongoClient.db(process.env.AUTH_DB_NAME || "mentorlagbe_auth");
const baseURL=process.env.BETTER_AUTH_URL || "http://localhost:5000";
const origins=(process.env.CLIENT_URL || "http://localhost:3000").split(",").map(x=>x.trim()).filter(Boolean);

export const auth=betterAuth({
  database:mongodbAdapter(authDb,{client:mongoClient}),
  secret:process.env.BETTER_AUTH_SECRET,
  ...(process.env.AUTH_CROSS_SITE_COOKIES==="true"?{
    advanced:{useSecureCookies:true,defaultCookieAttributes:{sameSite:"none",secure:true,httpOnly:true}}
  }:{}),
  baseURL,
  trustedOrigins:origins,
  emailAndPassword:{enabled:true,minPasswordLength:8},
  user:{additionalFields:{
    role:{type:"string",required:false,defaultValue:"student",input:true},
    plan:{type:"string",required:false,defaultValue:"free",input:false}
  }},
  plugins:[jwt()],
  hooks:{before:createAuthMiddleware(async ctx=>{
    const isSignUp=String(ctx.path||"").endsWith("/sign-up/email");
    if(isSignUp){
      const role=ctx.body?.role ?? "student";
      try{validatePublicRole(role);}catch{throw new APIError("BAD_REQUEST",{message:"Choose Student or Tutor"});}
    }
    if(!isSignUp && (Object.hasOwn(ctx.body || {},"role") || Object.hasOwn(ctx.body || {},"plan"))){
      throw new APIError("FORBIDDEN",{message:"Role and plan are server-controlled"});
    }
  })},
  databaseHooks:{user:{
    create:{after:async user=>{
      const email=String(user.email||"").toLowerCase();
      if(!email)return;
      await db.collection("users").updateOne({email},{
        $setOnInsert:{name:user.name||"Member",email,role:user.role==="tutor"?"tutor":"student",plan:"free",phone:"",bio:"",image:user.image||"",savedTuitionIds:[],createdAt:new Date()}
      },{upsert:true});
    }},
    update:{after:async user=>{
      if(!user.email)return;
      await db.collection("users").updateOne({email:String(user.email).toLowerCase()},{$set:{name:user.name||"Member",image:user.image||""}});
    }}
  }}
});

export async function ensureProfile(authUser){
  const email=String(authUser.email || "").toLowerCase();
  const role=["student","tutor","admin"].includes(authUser.role)?authUser.role:"student";
  await db.collection("users").updateOne({email},{$setOnInsert:{email,name:authUser.name||"Member",role,plan:authUser.plan==="pro"?"pro":"free",phone:"",bio:"",image:authUser.image||"",savedTuitionIds:[],createdAt:new Date()}},{upsert:true});
  return db.collection("users").findOne({email});
}
