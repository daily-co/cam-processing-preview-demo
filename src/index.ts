import Daily, { DailyCall, DailyMeetingState } from "@daily-co/daily-js";

function setupLiveCallClient() {
  const call = Daily.createCallObject({
    url: "https://paulk.staging.daily.co/hello",
  });
  //@ts-ignore
  window.call = call;
  return call;
}

function setupPreviewCallClient() {
  const previewer = Daily.createCallObject({
    startAudioOff: true,
    dailyConfig: { alwaysIncludeMicInPermissionPrompt: false },
    strictMode: false, // allow multiple call clients
  });
  //@ts-ignore
  window.previewer = previewer;
  return previewer;
}

function setupTogglePreviewButtonClickHandler(previewer: DailyCall) {
  const togglePreviewButton = document.getElementById(
    "toggle-preview"
  ) as HTMLButtonElement;
  togglePreviewButton.addEventListener("click", () => {
    if (previewer.meetingState() === "new") {
      previewer.startCamera();
    } else {
      previewer.setLocalVideo(!previewer.localVideo());
    }
  });
}

function setupLiveCamViewListeners(call: DailyCall) {
  call.on("participant-updated", (event) => {
    if (!event.participant.local) {
      return;
    }
    updateLiveCamView(event.participant.tracks.video.track);
  });
  call.on("left-meeting", () => updateLiveCamView(null));
  call.on("error", () => updateLiveCamView(null));
}

function setupPreviewCamViewListeners(previewer: DailyCall) {
  previewer.on("participant-updated", (event) => {
    // There's only ever a local participant in the previewer call client
    updatePreviewCamView(event.participant.tracks.video.track);
  });
}

function setupJoinLeaveButtonStateListeners(call: DailyCall) {
  call.on("joining-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("joined-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("left-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("error", () => updateJoinLeaveButton(call.meetingState()));
  call.on("loading", () => updateJoinLeaveButton(call.meetingState()));
  call.on("loaded", () => updateJoinLeaveButton(call.meetingState()));
}

function setupJoinLeaveButtonClickHandler(call: DailyCall) {
  const joinLeaveButton = document.getElementById(
    "join-or-leave-call"
  ) as HTMLButtonElement;
  joinLeaveButton.addEventListener("click", () => {
    const meetingState = call.meetingState();
    updateJoinLeaveButton(meetingState, true);
    switch (meetingState) {
      case "new":
      case "left-meeting":
      case "error":
        call.join();
        break;
      case "joined-meeting":
        call.leave();
        break;
      default:
        // Button should've been disabled in all other meeting states, so it
        // shouldn't be possible to get here
        break;
    }
  });
}

function updateLiveCamView(track?: MediaStreamTrack | null) {
  const element = document.getElementById("live-cam") as HTMLVideoElement;
  updateCamView(element, track);
}

function updatePreviewCamView(track?: MediaStreamTrack | null) {
  const element = document.getElementById("preview-cam") as HTMLVideoElement;
  updateCamView(element, track);
}

function updateCamView(
  element: HTMLVideoElement,
  track?: MediaStreamTrack | null
) {
  if (!track) {
    element.srcObject = null;
  } else if (
    (element.srcObject as MediaStream)?.getVideoTracks()[0] !== track
  ) {
    element.srcObject = new MediaStream([track]);
  }
}

function updateJoinLeaveButton(
  meetingState: DailyMeetingState,
  optimisticDisable: boolean = false
) {
  const joinLeaveButton = document.getElementById(
    "join-or-leave-call"
  ) as HTMLButtonElement;
  switch (meetingState) {
    case "new":
    case "left-meeting":
    case "error":
      joinLeaveButton.textContent = "Join";
      joinLeaveButton.disabled = optimisticDisable || false;
      break;
    case "joined-meeting":
      joinLeaveButton.textContent = "Leave";
      joinLeaveButton.disabled = optimisticDisable || false;
      break;
    default:
      joinLeaveButton.disabled = true;
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const call = setupLiveCallClient();
  const previewer = setupPreviewCallClient();

  // Initialize UI
  updateJoinLeaveButton(call.meetingState());

  // Wire up listeners/handlers
  setupLiveCamViewListeners(call);
  setupJoinLeaveButtonStateListeners(call);
  setupJoinLeaveButtonClickHandler(call);
  setupPreviewCamViewListeners(previewer);
  setupTogglePreviewButtonClickHandler(previewer);
});
