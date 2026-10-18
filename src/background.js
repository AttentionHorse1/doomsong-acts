import OBR from "@owlbear-rodeo/sdk";
import { MODAL_ID, STATE_KEY, readState } from "./state.js";

const MODAL_DURATION_MS = 2900;
let current = null;
let sceneReady = false;
let unsubscribe = null;
let closeTimer;

async function updateBadge(state) {
  // Zawsze pokazuj ikonę kruka, również podczas walki.
  await OBR.action.setBadgeText(undefined);
  await OBR.action.setIcon(`${import.meta.env.BASE_URL}icon.svg`);
}

async function announce(state) {
  // A participant reconnecting doesn't receive an old announcement.
  if (!state.active && state.phase === 0) {
    await OBR.modal.close(MODAL_ID).catch(() => {});
    return;
  }
  if (Date.now() - state.updatedAt > 8000) return;
  clearTimeout(closeTimer);
  await OBR.modal.close(MODAL_ID).catch(() => {});
  await OBR.modal.open({
    id: MODAL_ID,
    url: `${import.meta.env.BASE_URL}announcement.html?phase=${state.phase}&round=${state.round}&revision=${state.revision}`,
    width: 750,
    height: 750,
    hideBackdrop: true,
    hidePaper: true,
  });
  closeTimer = setTimeout(() => { void OBR.modal.close(MODAL_ID).catch(() => {}); }, MODAL_DURATION_MS);
}

async function handleState(metadata, initial = false) {
  const state = readState(metadata[STATE_KEY]);
  if (current?.revision === state.revision && current?.active === state.active && current?.phase === state.phase) return;
  const previouslyInitialized = current !== null;
  current = state;
  await updateBadge(state);
  if (!initial && previouslyInitialized) await announce(state);
}

async function mountScene(ready) {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  current = null;
  clearTimeout(closeTimer);
  await OBR.modal.close(MODAL_ID).catch(() => {});
  sceneReady = ready;
  if (!ready) { await OBR.action.setBadgeText(undefined); await OBR.action.setIcon(`${import.meta.env.BASE_URL}icon.svg`); return; }
  unsubscribe = OBR.scene.onMetadataChange((metadata) => { void handleState(metadata).catch(console.error); });
  const metadata = await OBR.scene.getMetadata();
  await handleState(metadata, true);
}

OBR.onReady(async () => {
  await mountScene(await OBR.scene.isReady());
  OBR.scene.onReadyChange((ready) => { void mountScene(ready).catch(console.error); });
});
