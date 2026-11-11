'use strict';
const PRO_ORIGIN = window.LIFECOME_CONFIG?.professionalOrigin || location.origin;
let sharedProfessionalRecord=null;try{sharedProfessionalRecord=JSON.parse(sessionStorage.getItem('lifecome-professional-release')||'null');}catch(_){}
function acceptProfessionalRecord(message){
 if(message?.type!=='LIFECOME_RECORD_UPDATE'||message.demoOnly!==true||message.schemaVersion!=='1.0')throw Error('Select a LifeCome released record.');
 const x=message.record;if(!['LC-DEMO-1001','LC-DEMO-1002','LC-DEMO-1003'].includes(x?.patient?.id)||typeof x.patient.name!=='string')throw Error('Unrecognised patient record.');
 if(JSON.stringify(message).length>150000)throw Error('The record is too large.');
 sharedProfessionalRecord=x;sessionStorage.setItem('lifecome-professional-release',JSON.stringify(x));
 if(typeof render==='function'&&LC.current==='professional-records')render('professional-records');
 return x;
}
const sharedSection=(h,body)=>`<section class="panel"><h2>${h}</h2>${body}</section>`;
add('professional-records','Health records','Professional record updates','Released records received from the Professional Portal.',()=>{
 const x=sharedProfessionalRecord;let body=back('records')+title('Your updated<br>health records','Information released by your LifeCome professionals.');
 if(!x)return body+note('Open this page from the Professional Portal to receive a released record. You can also import an exported record below.')+`<label class="field"><span>Import released record</span><input type="file" id="professional-import" accept="application/json,.json"></label>`+btn('Back to Health Records','records');
 const text=v=>`<p style="white-space:pre-wrap">${esc(v)}</p>`;
 body+=details([['Patient',esc(x.patient.name)],['Patient ID',esc(x.patient.id)],['Record updated',esc(x.updatedAt)]])+badge('Connected record','blue')+note('Draft notes and unreleased results are excluded.');
 body+=sharedSection('Consultation summary',x.consultation?text(x.consultation.summary)+text(x.consultation.followup)+`<small>${esc(x.consultation.author)} · ${esc(x.consultation.signedAt)}</small>`:text('No consultation summary released.'));
 if(x.consultation?.fullNote)body+=sharedSection('Released clinical note',Object.entries(x.consultation.fullNote).filter(([k])=>!['share','addenda'].includes(k)).map(([k,v])=>`<h3>${esc(k)}</h3>${text(v)}`).join('')+(x.consultation.fullNote.addenda||[]).map(a=>text('Addendum: '+a.text+' · '+a.author)).join(''));
 body+=sharedSection('Prescriptions',x.prescription?x.prescription.status==='Cancelled'?text('The prescription has been cancelled.'):text(x.prescription.medicine)+text(x.prescription.directions)+note('Authorised. Not yet dispensed.'):text('No authorised prescription.'));
 body+=sharedSection('Test results',x.result?text(x.result.explanation)+details([['Next step',esc(x.result.action)],['Follow-up due',esc(x.result.due)]]):text('No reviewed result released.'));
 body+=sharedSection('Observations',x.observations?details([['Blood pressure',esc(x.observations.bp)+' mmHg'],['Pulse',esc(x.observations.pulse)+' beats/min'],['Temperature',esc(x.observations.temperature)+' °C']]):text('No observations recorded.'));
 body+=sharedSection('Referrals',x.referral?text(x.referral.specialty)+text(x.referral.status):text('No shared referral.'));
 body+=sharedSection('Care visit summary',x.care?text(x.care.delivered)+text(x.care.handover):text('No signed care summary.'));
 body+=sharedSection('Wellbeing plan',x.wellbeing?text(x.wellbeing.goal)+text(x.wellbeing.plan):text('No shared wellbeing plan.'));
 body+=`<label class="field"><span>Import another released record</span><input type="file" id="professional-import" accept="application/json,.json"></label>`;
 return body;
},'records');
const priorRecordHub=LC.screens.records.render;LC.screens.records.render=()=>row('file','Professional record updates',sharedProfessionalRecord?'Updated records for '+esc(sharedProfessionalRecord.patient.name):'Notes, prescriptions, results and plans from your professionals','professional-records','blue')+priorRecordHub();
window.addEventListener('message',e=>{if(e.origin!==PRO_ORIGIN||e.source!==window.opener)return;try{const x=acceptProfessionalRecord(e.data);e.source.postMessage({type:'LIFECOME_RECORD_RECEIVED',patientId:x.patient.id},PRO_ORIGIN);}catch(_){}});
window.addEventListener('load',()=>{if(window.opener)window.opener.postMessage({type:'LIFECOME_PATIENT_READY'},PRO_ORIGIN);});
document.addEventListener('change',async e=>{if(e.target.id!=='professional-import')return;try{const file=e.target.files[0];if(!file||file.size>150000)throw Error('Choose a JSON record smaller than 150 KB.');acceptProfessionalRecord(JSON.parse(await file.text()));toast('Patient Health Records updated from the released record.');}catch(err){toast(err.message);}});
