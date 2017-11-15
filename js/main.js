function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    callback(url);
  });
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  var searchUrl = 'http://rss.sciam.com/ScientificAmerican-Global';
  var _request = new XMLHttpRequest();
  _request.open('GET', searchUrl);

  _request.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = _request.response;

    if (!response || response.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response;
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult;
    callback(imageUrl);
  };
  _request.onerror = function() {
    errorCallback('Network error.');
  };
  _request.send();
}


function loadData(xml) {

    var xmlContent = document.createElement('div');
    xmlContent.innerHTML = xml;

    var items = xmlContent.getElementsByTagName('item');
    var statusDiv = getElem('newsList');

    for(var i=0; i < items.length; i++){

        var anchor = document.createElement('A'),
            getLinkUrl = items[i].getElementsByTagName('link')[0],
            newsList = document.createElement('LI'),
            textnode = document.createTextNode(items[i].getElementsByTagName('title')[0].textContent);

        newsList.className = 'newsList';
        anchor.href = getLinkUrl.nextSibling.data;
        anchor.target = "_blank";
        anchor.appendChild(textnode);
        newsList.appendChild(anchor);
        statusDiv.appendChild(newsList);

	}
}

function renderStatus (statusText) {
  getElem('newsList').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    getImageUrl(url, function(xml) {

       loadData(xml);
       console.log('ss');
    }, function(errorMessage) {

      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});
