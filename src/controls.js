import OBR from "@owlbear-rodeo/sdk";
import "./theme.css";
import {PHASE_NAMES,STATE_KEY,nextState,readState} from "./state.js";
const el=id=>document.getElementById(id);
const app=el("app"),loading=el("loading"),message=el("message");
const previous=el("previous"),next=el("next"),toggle=el("toggle");
let current=readState(null);
let isGM=false;
let saving=false;
let unsubscribe=null;
function render(){
  el("phase-name").textContent=current.active?PHASE_NAMES[current.phase]:"SPOCZYNEK";
  el("combat-label").textContent=current.active?"TRWA WALKA":"WALKA UŚPIONA";
  el("round").textContent=String(current.round);
  el("phase-indicator").textContent=current.active?"✣ · I · II · III · IV · V · VI":"—";
  toggle.textContent=current.active?"Zakończ walkę":"Rozpocznij walkę";
  toggle.classList.toggle("danger",current.active);
  previous.disabled=!current.active||!isGM||saving;
  next.disabled=!current.active||!isGM||saving;
  toggle.disabled=!isGM||saving;
  if(!isGM)message.textContent="Sterowanie dostępne tylko dla MG.";
}
async function load(){
  if(!(await OBR.scene.isReady())){
    app.hidden=true;loading.hidden=false;
    loading.textContent="Otwórz scenę w Owlbear Rodeo, aby sterować walką.";
    return;
  }
  isGM=(await OBR.player.getRole())==="GM";
  current=readState((await OBR.scene.getMetadata())[STATE_KEY]);
  app.hidden=false;loading.hidden=true;render();
  if(unsubscribe)unsubscribe();
  unsubscribe=OBR.scene.onMetadataChange(metadata=>{current=readState(metadata[STATE_KEY]);render();});
}
async function change(operation){
  if(saving||!isGM)return;
  saving=true;message.textContent="Ogłaszanie…";render();
  try{
    if((await OBR.player.getRole())!=="GM")throw new Error("Tylko MG może sterować walką.");
    const fresh=readState((await OBR.scene.getMetadata())[STATE_KEY]);
    const changed=nextState(fresh,operation);
    await OBR.scene.setMetadata({[STATE_KEY]:changed});
    current=changed;message.textContent="";
  }catch(error){message.textContent=error?.message||"Nie udało się zmienić aktu.";}
  finally{saving=false;render();}
}
previous.addEventListener("click",()=>{void change("previous");});
next.addEventListener("click",()=>{void change("next");});
toggle.addEventListener("click",()=>{void change(current.active?"stop":"start");});
OBR.onReady(async()=>{
  try{await load();OBR.scene.onReadyChange(()=>{void load().catch(console.error);});}
  catch(error){loading.textContent=`Błąd: ${error?.message||error}`;}
});
