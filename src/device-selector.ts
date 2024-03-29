import { DailyCall } from "@daily-co/daily-js";

export function updateDeviceSelector(call: DailyCall) {
  const deviceSelectElement = document.getElementById(
    "devices"
  ) as HTMLSelectElement;

  // TODO: handle selecting a device right off the bat
  // (might not matter for this demo, where we don't store device pref in
  // cookies and so we assume the first-listed device will be selected initially)

  call.enumerateDevices().then((devices) => {
    // Get list of old device options
    const oldDeviceOptions: Record<string, HTMLOptionElement> = {};
    for (const deviceOption of deviceSelectElement.options) {
      oldDeviceOptions[deviceOption.value] = deviceOption;
    }

    // Add/update devices in select element
    const cameraDevices = devices.devices.filter((d) => d.kind == "videoinput");
    for (const device of cameraDevices) {
      let option = oldDeviceOptions[device.deviceId];
      if (option) {
        // Device still around: remove it from old device list so later we can
        // remove from the select element any devices that went away
        delete oldDeviceOptions[device.deviceId];
      } else {
        // Create option element for a new device
        option = new Option();
        option.value = device.deviceId;
        deviceSelectElement.appendChild(option);
      }
      option.text = device.label;
    }

    // Remove devices that went away from select element
    for (const oldDeviceOption of Object.values(oldDeviceOptions)) {
      oldDeviceOption.remove();
    }
  });
}

export function setupDeviceListUpdateListener(
  call: DailyCall,
  previewer: DailyCall
) {
  call.on("available-devices-updated", () => {
    updateDeviceSelector(call);
  });
  // The below is for FF: we don't get labels for devices until first gUM occurs.
  // Listening for track started is one way (but not the only way) to try
  // something after gUM has happened at least once.
  call.on("track-started", () => {
    updateDeviceSelector(call);
  });
  previewer.on("track-started", () => {
    updateDeviceSelector(previewer);
  });
}

export function setupDeviceSelectListener(
  call: DailyCall,
  previewer: DailyCall
) {
  const deviceSelectElement = document.getElementById(
    "devices"
  ) as HTMLSelectElement;

  deviceSelectElement.addEventListener("change", () => {
    const option = deviceSelectElement.selectedOptions[0];
    call.setInputDevicesAsync({ videoDeviceId: option.value });
    previewer.setInputDevicesAsync({ videoDeviceId: option.value });
  });
}
