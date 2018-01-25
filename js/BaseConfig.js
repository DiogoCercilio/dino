BASECONFIG = {
    DEFAULT_WIDTH: 600,
    FPS: 60,
    IS_HIDPI: window.devicePixelRatio > 1,
    IS_IOS: /iPad|iPhone|iPod/.test(window.navigator.platform),
    IS_MOBILE: /Android/.test(window.navigator.userAgent) || this.IS_IOS,
    IS_TOUCH_ENABLED: 'ontouchstart' in window,
    ARCADE_MODE_URL: 'chrome://dino/',
    RUNNER_FILLSTYLE: '#F00'
};
