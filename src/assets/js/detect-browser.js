function detectBrowser(target = undefined) {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined'; 
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isOpera) {
        target = "Opera";
        return "Opera";
    }
    if (isFirefox) {
        target = "Firefox";
        return "Firefox";
    }
    if (isSafari) {
        target = "Safari";
        return "Safari";
    }
    if (isIE) {
        target = "Internet Explorer";
        return "Internet Explorer";
    }
    if (isEdge) {
        target = "Edge";
        return "Edge";
    }
    if (isChrome) {
        target = "Chrome";
        return "Chrome";
    }
    if (isBlink) {
        target = "Blink";
        return "Blink";
    }
     
    target = "Unavailable";
    return "Unavailable";
}