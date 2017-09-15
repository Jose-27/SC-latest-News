(function(window) {

    'strict';

    window.qs = function (selector, scope){
        return (scope || document).getElementById(selector);
    };
    window._crElement = function (selector, scope){
        return (scope || document).createElement(selector);
    };
}(window));
