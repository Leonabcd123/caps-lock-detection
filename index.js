import { getCurrentOs } from "./os-detection.js";
let previousCapsState = false;
let capsState = false;
export const os = getCurrentOs();
let onCapsChangeCallback;
const mouseEventsToUpdateOn = ["mousedown", "mousemove", "wheel"];
const isMobile = navigator.maxTouchPoints > 1;
let isUsingExternalKeyboard = !isMobile;
function callCallbackIfNeeded() {
    const callCallback = previousCapsState !== capsState;
    previousCapsState = capsState;
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
        if (!isUsingExternalKeyboard) {
            capsState = getCapsLockModifierState(event);
            callCallbackIfNeeded();
        }
    });
});
document.addEventListener("keyup", (event) => {
    if (os === "Mac") {
        if (event.key === "CapsLock") {
            capsState = false;
        }
        else {
            const currentCapsState = getCapsLockModifierState(event);
            if (isUsingExternalKeyboard || currentCapsState) {
                capsState = currentCapsState;
                isUsingExternalKeyboard = true;
            }
        }
    }
    else if (os === "Windows") {
        capsState = getCapsLockModifierState(event);
    }
    else if (event.key !== "CapsLock" && event.key !== "Unidentified") {
        capsState = getCapsLockModifierState(event);
    }
    callCallbackIfNeeded();
});
document.addEventListener("keydown", (event) => {
    if (os === "Mac") {
        if (event.key === "CapsLock") {
            capsState = true;
            callCallbackIfNeeded();
        }
    }
    else if (os === "Linux") {
        if (event.key === "CapsLock") {
            capsState = !getCapsLockModifierState(event);
            isUsingExternalKeyboard = true;
        }
    }
});
export function isCapsLockOn() {
    return capsState;
}
export function onCapsLockChange(callback) {
    onCapsChangeCallback = callback;
}
