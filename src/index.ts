import { setupLiveCallClient, setupPreviewCallClient } from "./call-clients";
import {
  setupJoinLeaveButtonClickHandler,
  setupJoinLeaveButtonStateListeners,
  updateJoinLeaveButton,
} from "./join-leave-button";
import {
  setupDeviceListUpdateListener,
  setupDeviceSelectListener,
  updateDeviceSelector,
} from "./device-selector";
import {
  setupLiveCamViewListeners,
  setupPreviewCamViewListeners,
  setupTogglePreviewButtonClickHandler,
} from "./cam-views";
import {
  setupApplyEffectButtonClickHandler,
  setupEffectSelectListener,
} from "./effect-selector";

document.addEventListener("DOMContentLoaded", () => {
  const call = setupLiveCallClient();
  const previewer = setupPreviewCallClient();

  // Join/leave button
  // - set initial state
  updateJoinLeaveButton(call.meetingState());
  // - set listeners
  setupJoinLeaveButtonStateListeners(call);
  setupJoinLeaveButtonClickHandler(call);

  // Device selector
  // - set initial state
  updateDeviceSelector(call);
  // - set listeners
  setupDeviceListUpdateListener(call, previewer);
  setupDeviceSelectListener(call, previewer);

  // Cam views & preview toggle button
  // - set listeners
  setupLiveCamViewListeners(call);
  setupPreviewCamViewListeners(previewer);
  setupTogglePreviewButtonClickHandler(previewer);

  // Effect selector & apply button
  setupEffectSelectListener(previewer);
  setupApplyEffectButtonClickHandler(call, previewer);
});
