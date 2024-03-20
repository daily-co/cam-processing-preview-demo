import Daily from "@daily-co/daily-js";

document.addEventListener("DOMContentLoaded", () => {
  const call = Daily.createCallObject({
    url: "https://paulk.staging.daily.co/hello",
  });

  call.join();

  //@ts-ignore
  window.call = call;
});
