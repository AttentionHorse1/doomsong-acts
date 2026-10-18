import OBR from "@owlbear-rodeo/sdk";
import {MODAL_ID,STATE_KEY,phaseBadge,readState} from "./state.js";
const MODAL_DURATION_MS=2900;
let current=null;
let unsubscribe=null;
let closeTimer;
async function updateBadge(state){
  await OBR.action.setBadgeText(phaseBadge(state));
  if(state.active) await OBR.action.setBadgeBackgroundColor("#22201b");
}
async function announce(state){
  if(!state.active){
    await OBR.modal.close(MODAL_ID).catch(()=>{});
    return;
  }
  if(Date.now()-state.updatedAt>8000) return;
  clearTimeout(closeTimer);
  await OBR.modal.close(MODAL_ID).catch(()=>{});
  await OBR.modal.open({
    id:MODAL_ID,
    url:`${import.meta.env.BASE_URL}announcement.html?phase=${state.phase}&round=${state.round}&revision=${state.revision}`,
    width:680,height:300,hideBackdrop:true
  });
  closeTimer=setTimeout(()=>{void OBR.modal.close(MODAL_ID).catch(()=>{});},MODAL_DURATION_MS);
}
async function handleState(metadata,initial=false){
  const state=readState(metadata[STATE_KEY]);
  if(current?.revision===state.revision&&current?.active===state.active&&current?.phase===state.phase) return;
  const previouslyInitialized=current!==null;
  current=state;
  await updateBadge(state);
  if(!initial&&previouslyInitialized) await announce(state);
}
async function mountScene(ready){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  current=null;
  clearTimeout(closeTimer);
  await OBR.modal.close(MODAL_ID).catch(()=>{});
  if(!ready){await OBR.action.setBadgeText(undefined);return;}
  unsubscribe=OBR.scene.onMetadataChange(metadata=>{void handleState(metadata).catch(console.error);});
  await handleState(await OBR.scene.getMetadata(),true);
}
OBR.onReady(async()=>{
  await mountScene(await OBR.scene.isReady());
  OBR.scene.onReadyChange(ready=>{void mountScene(ready).catch(console.error);});
});
