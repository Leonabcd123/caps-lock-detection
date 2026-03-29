import { getCurrentOs } from "./os-detection.js";
let capsState = false;
export const os = getCurrentOs();
let onCapsChangeCallback;
const mouseEventsToUpdateOn = ["mousedown", "mousemove", "wheel"];
const isiPad = os === "Mac" && navigator.maxTouchPoints > 1;
let isSendingCapsLockState = !isiPad;
function setCapsLockState(newState, skipCallback) {
    const callCallback = !skipCallback && capsState !== newState;
    capsState = newState;
    if (callCallback) {
        onCapsChangeCallback === null || onCapsChangeCallback === void 0 ? void 0 : onCapsChangeCallback(capsState);
    }
}
function getCapsLockModifierState(event) {
    var _a, _b;
    return (_b = (_a = event.getModifierState) === null || _a === void 0 ? void 0 : _a.call(event, "CapsLock")) !== null && _b !== void 0 ? _b : capsState;
}
mouseEventsToUpdateOn.forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
        if (!isiPad) {
            setCapsLockState(getCapsLockModifierState(event));
        }
    });
});
document.addEventListener("keyup", (event) => {
    if (os === "Mac") {
        if (event.key === "CapsLock") {
            setCapsLockState(false);
        }
        else {
            const currentCapsState = getCapsLockModifierState(event);
            if (isSendingCapsLockState || currentCapsState) {
                setCapsLockState(currentCapsState);
                isSendingCapsLockState = true;
            }
        }
    }
    else if (os === "Windows") {
        setCapsLockState(getCapsLockModifierState(event));
    }
    else if (event.key !== "CapsLock" && event.key !== "Unidentified") {
        setCapsLockState(getCapsLockModifierState(event));
    }
    console.warn(capsState);
});
document.addEventListener("keydown", (event) => {
    if (os === "Mac") {
        if (event.key === "CapsLock") {
            setCapsLockState(true);
        }
    }
    else if (os === "Linux") {
        if (event.key === "CapsLock") {
            setCapsLockState(!getCapsLockModifierState(event), true);
        }
    }

    console.warn(capsState);
});
export function isCapsLockOn() {
    return capsState;
}
export function onCapsLockChange(callback) {
    onCapsChangeCallback = callback;
}
