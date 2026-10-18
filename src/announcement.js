import OBR from "@owlbear-rodeo/sdk";
import "./theme.css";
import { PHASE_NAMES, MODAL_ID } from "./state.js";

const phase = Number(new URLSearchParams(location.search).get("phase"));
const valid = Number.isInteger(phase) && phase >= 0 && phase <= 6 ? phase : 0;
const art = document.getElementById("act-art");
art.src = `${import.meta.env.BASE_URL}acts/${valid}.webp`;
art.alt = PHASE_NAMES[valid];
// Fallback, gdy klient straci zdarzenie zamykające z głównego skryptu.
OBR.onReady(() => {
  setTimeout(() => { void OBR.modal.close(MODAL_ID).catch(() => {}); }, 2900);
});
