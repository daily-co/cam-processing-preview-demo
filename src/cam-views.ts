import { DailyCall } from "@daily-co/daily-js";

export function setupLiveCamViewListeners(call: DailyCall) {
  call.on("participant-updated", (event) => {
    if (!event.participant.local) {
      return;
    }
    updateLiveCamView(event.participant.tracks.video.track);
  });
  call.on("left-meeting", () => updateLiveCamView(null));
  call.on("error", () => updateLiveCamView(null));
}

export function setupPreviewCamViewListeners(previewer: DailyCall) {
  previewer.on("participant-updated", (event) => {
    // There's only ever a local participant in the previewer call client
    updatePreviewCamView(event.participant.tracks.video.track);
  });
}

export function setupTogglePreviewButtonClickHandler(previewer: DailyCall) {
  const togglePreviewButton = document.getElementById(
    "toggle-preview"
  ) as HTMLButtonElement;
  togglePreviewButton.addEventListener("click", () => {
    previewer.setLocalVideo(!previewer.localVideo());
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
