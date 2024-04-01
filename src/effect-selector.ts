import {
  DailyCall,
  DailyInputVideoProcessorSettings,
} from "@daily-co/daily-js";

export function setupEffectSelectorHandler(previewer: DailyCall) {
  const effectsSelectElement = document.getElementById(
    "effects"
  ) as HTMLSelectElement;
  effectsSelectElement.addEventListener("change", () => {
    const option = effectsSelectElement.selectedOptions[0];
    let processorSettings: DailyInputVideoProcessorSettings = { type: "none" };
    switch (option.value) {
      case "none":
        processorSettings = { type: "none" };
        break;
      case "blur-standard":
        processorSettings = { type: "background-blur", config: {} };
        break;
      case "blur-soft":
        processorSettings = {
          type: "background-blur",
          config: { strength: 0.25 },
        };
        break;
      case "blur-strong":
        processorSettings = {
          type: "background-blur",
          config: { strength: 1 },
        };
        break;
      case "image-1":
        processorSettings = { type: "background-image", config: { source: 1 } };
        break;
      case "image-2":
        processorSettings = { type: "background-image", config: { source: 2 } };
        break;
      case "image-3":
        processorSettings = { type: "background-image", config: { source: 3 } };
        break;
    }
    previewer.updateInputSettings({ video: { processor: processorSettings } });
  });
}

export function setupApplyEffectButtonClickHandler(
  call: DailyCall,
  previewer: DailyCall
) {
  const button = document.getElementById("apply-effect") as HTMLButtonElement;
  button.addEventListener("click", async () => {
    call.updateInputSettings(await previewer.getInputSettings());
  });
}
