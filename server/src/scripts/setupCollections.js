
require("dotenv").config();
const {getDb}=require("../config/db");

async function setupCollections(){
    const db=await getDb();

    const collections=[
        "users",
        "tuitions",
        "applications",
        "payments"
    ];

    const existing=await db.listCollections().toArray();
    const names=existing.map(item=>item.name);

    for(const name of collections){
        if(!names.includes(name)){
            await db.createCollection(name);
            console.log(`${name} created`);
        }
        else{
            console.log(`${name} already exists`);
        }
    }

    await db.collection("users").createIndex(
        {email:1},
        {unique:true}
    );

    await db.collection("tuitions").createIndex(
        {approvalStatus:1,isActive:1,createdAt:-1}
    );

    await db.collection("applications").createIndex(
        {tuitionId:1,studentEmail:1},
        {unique:true}
    );

    await db.collection("payments").createIndex(
        {stripeSessionId:1},
        {
            unique:true,
            partialFilterExpression:{
                stripeSessionId:{$type:"string"}
            }
        }
    );

    console.log("Database collections and indexes ready!");
}

setupCollections()
    .then(()=>process.exit(0))
    .catch(error=>{
        console.error(error.message);
        process.exit(1);
    });
