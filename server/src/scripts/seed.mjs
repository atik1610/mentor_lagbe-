import "dotenv/config";
import {auth,db,authDb,mongoClient} from "../auth.mjs";
const demoPassword=process.env.SEED_DEMO_PASSWORD;
if(!demoPassword||demoPassword.length<12){console.error("Set a 12+ character SEED_DEMO_PASSWORD in server/.env before seeding. Never commit it.");process.exit(1);}
const tutors=[
 {name:"Nusrat Ahmed",email:"demo.nusrat@mentorlagbe.example",subject:"Math",city:"Uttara, Dhaka"},
 {name:"Rafiul Karim",email:"demo.rafiul@mentorlagbe.example",subject:"Physics",city:"Mirpur, Dhaka"},
 {name:"Farzana Islam",email:"demo.farzana@mentorlagbe.example",subject:"Programming",city:"Savar, Dhaka"},
 {name:"Samiul Hasan",email:"demo.samiul@mentorlagbe.example",subject:"English",city:"Dhanmondi, Dhaka"},
 {name:"Tahmina Rahman",email:"demo.tahmina@mentorlagbe.example",subject:"IELTS",city:"Mohammadpur, Dhaka"},
 {name:"Adnan Sayeed",email:"demo.adnan@mentorlagbe.example",subject:"Chemistry",city:"Banani, Dhaka"}
];
const student={name:"Demo Learner",email:"demo.student@mentorlagbe.example"};
async function createUser(person,role){
 let user=await authDb.collection("user").findOne({email:person.email});
 if(!user){await auth.api.signUpEmail({body:{email:person.email,name:person.name,password:demoPassword,role}});user=await authDb.collection("user").findOne({email:person.email});}
 if(!user)throw new Error(`Failed to create ${person.email}`);
 await authDb.collection("user").updateOne({_id:user._id},{$set:{role,plan:"free"}});
 await db.collection("users").updateOne({email:person.email},{$set:{name:person.name,role,plan:"free",bio:role==="tutor"?"Demo tutor profile for evaluating MentorLagbe workflows.":"Demo learner account for evaluating the application process."},$setOnInsert:{phone:"",image:"",savedTuitionIds:[],createdAt:new Date()}},{upsert:true});
}
for(const person of tutors)await createUser(person,"tutor");
await createUser(student,"student");
const titlePairs={Math:["SSC Mathematics Problem Solving","HSC Calculus & Higher Math Workshop"],Physics:["HSC Physics Concept Masterclass","Physics Numericals and Mechanics Clinic"],Programming:["Python Fundamentals for Beginners","C++ and Data Structures Guided Practice"],English:["English Grammar & Writing Clinic","Academic English Conversation Lab"],IELTS:["IELTS Speaking Confidence Group","IELTS Reading & Writing One-to-One"],Chemistry:["HSC Chemistry Made Simple","Organic Chemistry Problem Solving"]};
const tuitions=db.collection("tuitions");
for(const [i,tutor] of tutors.entries())for(let j=0;j<2;j++){
 const seedKey=`ml-demo-${i}-${j}`;const mode=j===0?"Online":"Offline",subject=tutor.subject;
 const data={seedKey,title:titlePairs[subject][j],subject,classLevel:j===0?"Class 9-10":subject==="Programming"?"University":"HSC",offeringType:j===1?"One-to-one":"Batch",mode,location:mode==="Online"?"Online":tutor.city,monthlyFee:2500+i*450+j*900,daysPerWeek:j===0?3:2,bannerImage:"",description:`Learn ${subject} with clear explanations, structured practice, weekly learning goals and feedback. This is a connected demonstration listing created for MentorLagbe evaluation. Tutors and students can explore the complete application workflow.`,tutorName:tutor.name,tutorEmail:tutor.email,approvalStatus:"approved",isActive:true,createdAt:new Date(Date.now()-(i*2+j)*86_400_000),reviews:[]};
 await tuitions.updateOne({seedKey},{$setOnInsert:data},{upsert:true});
}
const first=await tuitions.findOne({seedKey:"ml-demo-0-0"});
if(first)await db.collection("applications").updateOne({tuitionId:first._id,studentEmail:student.email},{$setOnInsert:{tuitionId:first._id,tuitionTitle:first.title,subject:first.subject,monthlyFee:first.monthlyFee,tutorEmail:first.tutorEmail,tutorName:first.tutorName,studentName:student.name,studentEmail:student.email,studentPhone:"01000000000",preferredSchedule:"Weekday evenings",studentNote:"Demo application to verify accepted booking workflow",status:"accepted",appliedAt:new Date()}},{upsert:true});
console.log("Seed complete: 6 connected demo tutors, 1 demo student, 12 approved sample tuitions, 1 accepted sample application.");
console.log("All demo names, accounts and tuition posts are synthetic; do not portray them as verified real tutors.");
await mongoClient.close();
