// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
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

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'http://rss.sciam.com/ScientificAmerican-Global';
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;

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
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function myFunction(xml) {
    var xmlDoc = xml;
    document.getElementById("status").innerHTML =xmlDoc;
}


function loadData(xml){
    
    var tt = document.createElement('div');
    tt.innerHTML = xml;
    var items=tt.getElementsByTagName('item');
    var title, desc, thumb, swf;
    var statusDiv = document.getElementById('status');
    
    for(var i=0; i < items.length; i++){
		//alert('in the loop');
        console.log(items);
        var anchor = document.createElement('a');
        var br = document.createElement('br');
        var tt = items[i].getElementsByTagName('link')[0].textContent;
        anchor.href = '';
        anchor.appendChild(br);
        var textnode = document.createTextNode(items[i].getElementsByTagName('title')[0].textContent);
        anchor.appendChild(textnode);
        statusDiv.appendChild(anchor);
    
	}

}



document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    getImageUrl(url, function(xml) {
        
       loadData(xml);

    }, function(errorMessage) {

      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});

