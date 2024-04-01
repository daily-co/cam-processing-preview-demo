import { setupLiveCallClient, setupPreviewCallClient } from "./call-clients";
import {
  setupJoinLeaveButtonClickHandler,
  setupJoinLeaveButtonStateListeners,
  updateJoinLeaveButton,
} from "./join-leave-button";
import {
  setupDeviceListUpdateListener,
  setupDeviceSelectHandler,
  updateDeviceSelector,
} from "./device-selector";
import {
  setupLiveCamViewListeners,
  setupPreviewCamViewListeners,
  setupTogglePreviewButtonClickHandler,
} from "./cam-views";
import {
  setupApplyEffectButtonClickHandler,
  setupEffectSelectHandler,
} from "./effect-selector";

document.addEventListener("DOMContentLoaded", () => {
  const call = setupLiveCallClient();
  const previewer = setupPreviewCallClient();

  // Join/leave button
  // - set initial state
  updateJoinLeaveButton(call.meetingState());
  // - setup daily event listeners
  setupJoinLeaveButtonStateListeners(call);
  // - setup ui event listener
  setupJoinLeaveButtonClickHandler(call);

  // Device selector
  // - set initial state
  updateDeviceSelector(call);
  // - setup daily event listeners
  setupDeviceListUpdateListener(call, previewer);
  // - setup ui event listener
  setupDeviceSelectHandler(call, previewer);

  // Cam views & preview toggle button
  // - setup daily event listeners
  setupLiveCamViewListeners(call);
  setupPreviewCamViewListeners(previewer);
  // - setup ui event listener
  setupTogglePreviewButtonClickHandler(previewer);

  // Background Effect selector & apply button
  // - set ui event listeners
  setupEffectSelectHandler(previewer);
  setupApplyEffectButtonClickHandler(call, previewer);
});
