import Daily, { DailyMeetingState } from "@daily-co/daily-js";

function updatePublishedCamView(track?: MediaStreamTrack | null) {
  const publishedCamElement = document.getElementById(
    "published-cam"
  ) as HTMLVideoElement;

  if (!track) {
    publishedCamElement.srcObject = null;
  } else if (
    (publishedCamElement.srcObject as MediaStream)?.getVideoTracks()[0] !==
    track
  ) {
    publishedCamElement.srcObject = new MediaStream([track]);
  }
}

function updatePreviewCamView(track?: MediaStreamTrack) {}

function updateJoinLeaveButton(meetingState: DailyMeetingState) {
  const joinLeaveButton = document.getElementById(
    "join-or-leave-call"
  ) as HTMLButtonElement;
  switch (meetingState) {
    case "new":
    case "left-meeting":
    case "error":
      joinLeaveButton.textContent = "Join";
      joinLeaveButton.disabled = false;
      break;
    case "joined-meeting":
      joinLeaveButton.textContent = "Leave";
      joinLeaveButton.disabled = false;
      break;
    default:
      joinLeaveButton.disabled = true;
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const call = Daily.createCallObject({
    url: "https://paulk.staging.daily.co/hello",
  });
  //@ts-ignore
  window.call = call;

  // Setup event listener for published cam view
  call.on("participant-updated", (event) => {
    if (!event.participant.local) {
      return;
    }
    updatePublishedCamView(event.participant.tracks.video.track);
  });
  call.on("left-meeting", () => updatePublishedCamView(null));
  call.on("error", () => updatePublishedCamView(null));

  // Setup event listeners for button state
  call.on("joining-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("joined-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("left-meeting", () => updateJoinLeaveButton(call.meetingState()));
  call.on("error", () => updateJoinLeaveButton(call.meetingState()));
  call.on("loading", () => updateJoinLeaveButton(call.meetingState()));
  call.on("loaded", () => updateJoinLeaveButton(call.meetingState()));

  // Initialize join/leave button
  updateJoinLeaveButton(call.meetingState());

  // Setup event listener for join/leave button click
  const joinLeaveButton = document.getElementById(
    "join-or-leave-call"
  ) as HTMLButtonElement;
  joinLeaveButton.addEventListener("click", () => {
    const meetingState = call.meetingState();
    switch (meetingState) {
      case "new":
      case "left-meeting":
      case "error":
        joinLeaveButton.disabled = true;
        call.join();
        break;
      case "joined-meeting":
        joinLeaveButton.disabled = true;
        call.leave();
        break;
      default:
        // Button should've been disabled in all other meeting states
        break;
    }
  });
});
