'use strict';

function renderData(data){
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Top 5 Visited Sites",
            fontFamily: "Verdana",
            fontColor: "Peru",
            fontSize: 20
        },
        animationEnabled: true,
        axisY: {
            tickThickness: 0,
            lineThickness: 0,
            valueFormatString: " ",
            gridThickness: 0,
        },
        axisX: {
            tickThickness: 0,
            lineThickness: 0,
            labelFontSize: 18,
            labelFontColor: "#2A7A78"
        },
        backgroundColor: "#D1E5F0",
        data: [
        {
            indexLabelFontSize: 10,
            toolTipContent: "<span style='\"'font-size: 20px; color:peru '\"'><strong>{y} times</strong></span>",

            indexLabelPlacement: "outside",
            indexLabelFontColor: "#610606",
            indexLabelFontWeight: 200,
            indexLabelFontSize: 13,
            indexLabelFontFamily: "Verdana",
            color: "#62C9C3",
            type: "bar",
            dataPoints: data
        },
        ]
    });
    chart.render();
}

window.onload = function () {
  let historyData = [];
  chrome.history.search({text:"", startTime:1 ,maxResults:1000000}, function(results){
    var domainMap = new Map();
    for(let result of results) {
      var domain = result.url.split('/')[2].split(':')[0];
      if(domain.split('.').length > 2){
        domain = domain.split('.')[1] + '.' + domain.split('.')[2]
      }
      if(domainMap.has(domain)){
        domainMap.set(domain, domainMap.get(domain) + 1);
      }
      else {
        domainMap.set(domain, 1);
      }
    }
    var sortedDomainMap = [...domainMap.entries()].sort((a,b) => a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0)
    console.log(sortedDomainMap)
    for(let i = 4; i >= 0; --i){
      historyData.push({y: sortedDomainMap[i][1], label: sortedDomainMap[i][0], indexLabel: sortedDomainMap[i][1].toString()});
    }
    renderData(historyData);
  });
}