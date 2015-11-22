'use strict';
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;

    getVisitedTimes(url, function (times) {
      renderVisitedTimes(times);
    });

    callback(url);
  });
}

function getVisitedTimes(url, callback) {
  var domain = new URI(url).domain();
  chrome.history.search({ text: domain, startTime: 1, maxResults: 1000000 }, function (results) {
    var filteredResults = results.filter(function (result) {
      return new URI(result.url).domain() == domain;
    });
    if (filteredResults.length > 1) {
      renderLastVisited(filteredResults[1].lastVisitTime);
    }
    callback(filteredResults.length);
  });
}

function renderLastVisited(epochTime) {
  var timeAgo = moment(epochTime).fromNow();
  document.getElementById('lastVisited').innerHTML = '<span class=\'title\'>Last Visited: </span>' + timeAgo;
}

function renderUrl(currentUrl) {
  document.getElementById('url').textContent = currentUrl;
}

function renderVisitedTimes(visitedTimes) {
  document.getElementById('visitedTimes').innerHTML = '<span class=\'title\'>Visited Times: </span>' + visitedTimes;
}

document.addEventListener('DOMContentLoaded', function () {
  getCurrentTabUrl(function (url) {
    if (url.length > 35) url = url.substr(0, 34) + '...';
    renderUrl('Current Url: ' + url);
  });
});
