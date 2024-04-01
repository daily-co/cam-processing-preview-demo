import { DailyCall, DailyMeetingState } from "@daily-co/daily-js";

export function setupJoinLeaveButton(call: DailyCall) {
  // - set initial state
  updateJoinLeaveButton(call.meetingState());
  // - set listeners
  setupJoinLeaveButtonStateListeners(call);
  setupJoinLeaveButtonClickHandler(call);
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
