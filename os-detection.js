function isPlatform(osName) {
    var _a;
    if ((_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) {
        return osName.test(navigator.userAgentData.platform);
    }
    else {
        return (osName.test(navigator.oscpu) ||
            osName.test(navigator.userAgent) ||
            osName.test(navigator.platform));
    }
}
export function getCurrentOs() {
    if (isPlatform(/Mac/i)) {
        return "Mac";
    }
    if (isPlatform(/Linux/i)) {
        return "Linux";
    }
    if (isPlatform(/Android/i)) {
        return "Linux";
    }
    if (isPlatform(/Win/i)) {
        return "Windows";
    }
    return /Android/i.test(navigator.userAgentData.platform);
}
