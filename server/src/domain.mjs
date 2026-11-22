import {createHmac,timingSafeEqual} from "node:crypto";
export class DomainError extends Error {constructor(status,message){super(message);this.status=status;}}
export const safeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
export const planPrice=role=>role==="tutor"?1500:1000;
export function validatePublicRole(role){if(!["student","tutor"].includes(role))throw new DomainError(400,"Choose Student or Tutor");return role;}
const text=(v,max=500)=>typeof v==="string"?v.trim().slice(0,max):"";
function needed(v,label,max=500){const s=text(v,max);if(!s)throw new DomainError(400,`${label} is required`);return s;}
export function tuitionInput(body){
 const title=needed(body.title,"Title",120),subject=needed(body.subject,"Subject",80),classLevel=needed(body.classLevel,"Class level",80);
 const mode=needed(body.mode,"Mode",10);if(!["Online","Offline"].includes(mode))throw new DomainError(400,"Choose Online or Offline");
 const monthlyFee=Number(body.monthlyFee),daysPerWeek=Number(body.daysPerWeek);
 const bannerImage=text(body.bannerImage,700);
 if(bannerImage && !/^https:\/\//i.test(bannerImage))throw new DomainError(400,"Banner image must be an HTTPS URL");
 if(!Number.isFinite(monthlyFee)||monthlyFee<=0)throw new DomainError(400,"Enter a valid positive amount");
 if(!Number.isInteger(daysPerWeek)||daysPerWeek<1||daysPerWeek>7)throw new DomainError(400,"Days per week must be 1–7");
 return {title,subject,classLevel,mode,location:mode==="Online"?(text(body.location,120)||"Online"):needed(body.location,"Location",160),monthlyFee,daysPerWeek,description:needed(body.description,"Description",3000),bannerImage,offeringType:body.offeringType==="One-to-one"?"One-to-one":"Batch"};
}
export function stripeSignatureValid(raw,header,secret,now=Math.floor(Date.now()/1000)){
 if(!Buffer.isBuffer(raw) || typeof header!=="string" || !secret)return false;
 const timestampText=header.split(",").find(x=>x.startsWith("t="))?.slice(2);
 const timestamp=Number(timestampText);
 if(!timestampText || !Number.isFinite(timestamp) || Math.abs(now-timestamp)>300)return false;
 const expected=Buffer.from(createHmac("sha256",secret).update(`${timestampText}.${raw.toString("utf8")}`).digest("hex"),"hex");
 return header.split(",").filter(x=>x.startsWith("v1=")).some(x=>{
  const candidate=x.slice(3);return /^[0-9a-f]{64}$/i.test(candidate)&&timingSafeEqual(Buffer.from(candidate,"hex"),expected);
 });
}
