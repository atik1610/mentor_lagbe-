import test from "node:test";
import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import {safeRegex,tuitionInput,planPrice,stripeSignatureValid,validatePublicRole} from "../src/domain.mjs";
const valid={title:"HSC Math Tutorial",subject:"Math",classLevel:"HSC",mode:"Offline",location:"Mirpur",monthlyFee:2500,daysPerWeek:3,description:"Problem solving and revision for students",bannerImage:"",offeringType:"Batch"};
test("tuition post keeps required data and valid enum",()=>{assert.equal(tuitionInput(valid).monthlyFee,2500);assert.equal(tuitionInput(valid).mode,"Offline");});
test("rejects unsupported mode",()=>assert.throws(()=>tuitionInput({...valid,mode:"Anywhere"}),/Online or Offline/));
test("rejects negative fee",()=>assert.throws(()=>tuitionInput({...valid,monthlyFee:-1}),/positive/));
test("rejects impossible weekly schedule",()=>assert.throws(()=>tuitionInput({...valid,daysPerWeek:8}),/1–7/));
test("offline tuition requires location",()=>assert.throws(()=>tuitionInput({...valid,location:""}),/Location/));
test("regex search escapes malicious regular expressions",()=>assert.equal(safeRegex("Math.*(a)"),"Math\\.\\*\\(a\\)"));
test("stripe role fees are $10 and $15 in cents",()=>{assert.equal(planPrice("student"),1000);assert.equal(planPrice("tutor"),1500);});
test("correct Stripe HMAC verifies and forged signatures fail",()=>{
 const payload=Buffer.from('{"type":"checkout.session.completed"}'),time=1900000000,secret="whsec_test_only";
 const sig=createHmac("sha256",secret).update(`${time}.${payload.toString()}`).digest("hex");
 assert.equal(stripeSignatureValid(payload,`t=${time},v1=${sig}`,secret,time),true);
 assert.equal(stripeSignatureValid(Buffer.from("altered"),`t=${time},v1=${sig}`,secret,time),false);
 assert.equal(stripeSignatureValid(payload,`t=${time},v1=${sig}`,secret,time+400),false);
});

test("signup role only accepts Student or Tutor",()=>{assert.equal(validatePublicRole("student"),"student");assert.equal(validatePublicRole("tutor"),"tutor");assert.throws(()=>validatePublicRole("admin"),/Student or Tutor/);});
