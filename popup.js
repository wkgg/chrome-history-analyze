'use strict';
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    getVisitedTimes(url, function(times){
      renderVisitedTimes('Visited Times: ' + times)
    });

    callback(url);
  });
}

function getVisitedTimes(url, callback) {
  var domain = url.split('/')[2].split(':')[0].replace(/(www\.)|(mail\.)|(map\.)|(wiki\.)/, '')
  chrome.history.search({text:domain, startTime:1 ,maxResults:1000000}, function(results){
    if(results.length > 1){
      renderLastVisited(results[1].lastVisitTime);
    }
    callback(results.length);
  });
}

function renderLastVisited(epochTime) {
  var timeAgo = moment(epochTime).fromNow();  
  document.getElementById('lastVisited').textContent = "Last Visited: " + timeAgo;
}

function renderUrl(currentUrl) {
  document.getElementById('url').textContent = currentUrl;
}

function renderVisitedTimes(visitedTimesText) {
  document.getElementById('visitedTimes').textContent = visitedTimesText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    if(url.length > 35)
      url = url.substr(0, 34) + "..."
    renderUrl('Current Url: ' + url);
  });
});
