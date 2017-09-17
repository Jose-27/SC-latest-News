(function(window){

    'strict';

    window._getElem = function (selector, scope) {
        return (scope || document).getElementById(selector);
    }
    
    //helper for creating html elements
    window.cr = function (selector,scope) {
        return (scope || document).createElement(selector);
    }

    function renderStatus(statusText) {
    	_getElem('newsList').textContent = statusText;
	}

})(window);