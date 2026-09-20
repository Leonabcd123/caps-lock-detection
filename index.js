import { getPlatformInfo } from "./platform-detection.js";
const CAPS_LOCK = "CapsLock";
const onCapsChangeCallbacks = [];
let capsState = false;
export const { os, isMobile } = getPlatformInfo();
if (os !== "Unknown") {
    const mouseEventsToUpdateOn = ["mousedown", "mousemove", "wheel"];
    const isiPad = os === "Mac" && isMobile;
    const windowsHandler = (event) => {
        return getCapsLockModifierState(event);
    };
    function createLinuxHandlers() {
        let disableCapsOnCapsKeyup = false;
        return {
            onKeydown: (event) => {
                if (event.key === CAPS_LOCK && disableCapsOnCapsKeyup) {
                    disableCapsOnCapsKeyup = false;
                }
                if (event.key === CAPS_LOCK) {
                    const flippedCapsState = !getCapsLockModifierState(event);
                    if (flippedCapsState) {
                        return true;
                    }
                    else {
                        disableCapsOnCapsKeyup = true;
                    }
                }
                return null;
            },
            onKeyup: (event) => {
                if (event.key === CAPS_LOCK && disableCapsOnCapsKeyup) {
                    disableCapsOnCapsKeyup = false;
                    return false;
                }
                if (event.key !== CAPS_LOCK && event.key !== "Unidentified") {
                    return getCapsLockModifierState(event);
                }
                return null;
            },
        };
    }
    function createMacHandlers() {
        let isSendingCapsLockState = !isiPad;
        return {
            onKeydown: (event) => {
                if (event.key === CAPS_LOCK) {
                    return getCapsLockModifierState(event);
                }
                return null;
            },
            onKeyup: (event) => {
                if (event.key === CAPS_LOCK) {
                    return false;
                }
                const currentCapsState = getCapsLockModifierState(event);
                if (isSendingCapsLockState || currentCapsState) {
                    isSendingCapsLockState = true;
                    return currentCapsState;
                }
                return null;
            },
        };
    }
    const platformHandlers = {
        Windows: () => ({ onKeydown: windowsHandler, onKeyup: windowsHandler }),
        Linux: createLinuxHandlers,
        Mac: createMacHandlers,
    };
    const { onKeydown, onKeyup } = platformHandlers[os]();
    function setCapsState(newCapsState) {
        if (capsState !== newCapsState) {
            capsState = newCapsState;
            onCapsChangeCallbacks.forEach((callback) => callback(capsState));
        }
    }
    function getCapsLockModifierState(event) {
        return event.getModifierState(CAPS_LOCK);
    }
    mouseEventsToUpdateOn.forEach((eventType) => {
        document.addEventListener(eventType, (event) => {
            if (!isiPad) {
                const currentCapsState = getCapsLockModifierState(event);
                if (!isMobile || !currentCapsState) {
                    setCapsState(currentCapsState);
                }
            }
        }, { passive: true });
    });
    function addKeyboardListener(type, handler) {
        document.addEventListener(type, (event) => {
            if (!(event instanceof KeyboardEvent))
                return;
            const newCapsState = handler(event);
            if (newCapsState !== null)
                setCapsState(newCapsState);
        });
    }
    addKeyboardListener("keydown", onKeydown);
    addKeyboardListener("keyup", onKeyup);
}
function isCapsLockOn() {
    return capsState;
}
function onCapsLockChange(callback) {
    onCapsChangeCallbacks.push(callback);
}
export { isCapsLockOn, onCapsLockChange };
