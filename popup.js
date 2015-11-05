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

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function getVisitedTimes(url, callback) {
  var domain = url.split('/')[2].split(':')[0].replace(/(www\.)|(mail\.)|(map\.)|(wiki\.)/, '')
  chrome.history.search({text:domain, startTime:1 ,maxResults:1000000}, function(results){
    renderLastVisited(results[1].lastVisitTime);
    callback(results.length);
  });
}

function renderLastVisited(epochTime) {
  var timeAgo = moment(epochTime).fromNow();  
  document.getElementById('lastVisited').textContent = "lastVisited: " + timeAgo;
}

function renderUrl(statusText) {
  document.getElementById('url').textContent = statusText;
}

function renderVisitedTimes(visitedTimesText) {
  document.getElementById('visitedTimes').textContent = visitedTimesText;
}

function renderTop5Websites() {
  chrome.history.search({text:"", startTime:1 ,maxResults:1000000}, function(results){
    var domainMap = new Map();
    for(let result of results) {
      var domain = result.url.split('/')[2].split(':')[0].replace(/(www\.)|(mail\.)|(map\.)|(wiki\.)/, '')
      if(domainMap.has(domain)){
        domainMap.set(domain, domainMap.get(domain) + 1);
      }
      else {
        domainMap.set(domain, 1);
      }
    }
    var sortedDomainMap = [...domainMap.entries()].sort((a,b) => a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0)
    let topContent = '';
    for(let i = 0; i < 5; ++i){
      topContent += (sortedDomainMap[i][0] + ": " + sortedDomainMap[i][1] + "<br />");
    }
    document.getElementById('top').innerHTML = topContent;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
      renderUrl('Current Url: ' + url);
  });
  renderTop5Websites();
});
