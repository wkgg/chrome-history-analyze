'use strict';

function renderData(data){
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "",
            fontFamily: "Verdana",
            fontColor: "Peru",
            fontSize: 20
        },
        height: 180,
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
            labelFontColor: "#515151"
        },
        backgroundColor: "#ffffff",
        data: [
        {
            indexLabelFontSize: 10,
            toolTipContent: "<span style='\"'font-size: 20px; color:peru '\"'><strong>{y} times</strong></span>",

            indexLabelPlacement: "outside",
            indexLabelFontColor: "#515151",
            indexLabelFontWeight: 200,
            indexLabelFontSize: 13,
            indexLabelFontFamily: "Verdana",
            color: "#2eb7d0",
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
      var domain = new URI(result.url).domain();
      if(domainMap.has(domain)){
        domainMap.set(domain, domainMap.get(domain) + 1);
      }
      else {
        domainMap.set(domain, 1);
      }
    }
    var sortedDomainMap = [...domainMap.entries()].sort((a,b) => a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0)
    for(let i = 4; i >= 0; --i){
      historyData.push({y: sortedDomainMap[i][1], label: sortedDomainMap[i][0], indexLabel: sortedDomainMap[i][1].toString()});
    }
    renderData(historyData);
  });
}