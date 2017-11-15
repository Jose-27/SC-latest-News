(function (window) {

    'strict';

    window.getElem = function (selector, scope) {
        return (scope || document).getElementById(selector);
    };

    window.cr = function (selector, scope) {
        return (scope || document).createElement(selector);
    };

}(window));
