import Daily from "@daily-co/daily-js";

export function setupLiveCallClient() {
  const call = Daily.createCallObject({
    url: "https://paulk.staging.daily.co/hello",
  });
  //@ts-ignore
  window.call = call;
  return call;
}

export function setupPreviewCallClient() {
  const previewer = Daily.createCallObject({
    startAudioOff: true,
    startVideoOff: true,
    dailyConfig: { alwaysIncludeMicInPermissionPrompt: false },
    strictMode: false, // allow multiple call clients
  });
  //@ts-ignore
  window.previewer = previewer;
  // This doesn't actually turn on the camera, since startVideoOff was set.
  // It just initializes the previewer. Yeah, I know :/
  previewer.startCamera();
  return previewer;
}
