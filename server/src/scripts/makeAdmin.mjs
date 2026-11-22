import "dotenv/config";
import {authDb,db,mongoClient} from "../auth.mjs";
const email=String(process.env.ADMIN_EMAIL||"").trim().toLowerCase();
if(!email){console.error("Set ADMIN_EMAIL in server/.env to an existing registered user's email.");process.exit(1);}
const authUser=await authDb.collection("user").findOne({email});
if(!authUser){console.error("Account not found. First sign up at the web application using this email.");process.exit(1);}
await authDb.collection("user").updateOne({_id:authUser._id},{$set:{role:"admin"}});
await db.collection("users").updateOne({email},{$set:{role:"admin",name:authUser.name},$setOnInsert:{plan:"free",phone:"",bio:"",image:authUser.image||"",createdAt:new Date()}},{upsert:true});
console.log(`Admin permissions granted to existing account ${email}. Sign out and sign back in to refresh permissions.`);
await mongoClient.close();
