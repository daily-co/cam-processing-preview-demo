import { setupLiveCallClient, setupPreviewCallClient } from "./call-clients";
import { setupJoinLeaveButton } from "./join-leave-button";
import { setupDeviceSelector } from "./device-selector";
import {
  setupLiveCamViewListeners,
  setupPreviewCamViewListeners,
  setupTogglePreviewButtonClickHandler,
} from "./cam-views";
import {
  setupApplyEffectButtonClickHandler,
  setupEffectSelectorHandler,
} from "./effect-selector";

document.addEventListener("DOMContentLoaded", () => {
  const call = setupLiveCallClient();
  const previewer = setupPreviewCallClient();

  // Join/leave button
  setupJoinLeaveButton(call);

  // Device selector
  setupDeviceSelector(call, previewer);

  // Cam views & preview toggle button
  // - setup daily event listeners
  setupLiveCamViewListeners(call);
  setupPreviewCamViewListeners(previewer);
  // - setup ui event listener
  setupTogglePreviewButtonClickHandler(previewer);

  // Background Effect selector & apply button
  // - set ui event listeners
  setupEffectSelectorHandler(previewer);
  setupApplyEffectButtonClickHandler(call, previewer);
});
