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
            gridThickness: 0                    
        },
        axisX: {
            tickThickness: 0,
            lineThickness: 0,
            labelFontSize: 18,
            labelFontColor: "Peru"

        },
        data: [
        {
            indexLabelFontSize: 10,
            toolTipContent: "<span style='\"'color: {color};'\"'><strong>{indexLabel}</strong></span><span style='\"'font-size: 20px; color:peru '\"'><strong>{y}</strong></span>",

            indexLabelPlacement: "inside",
            indexLabelFontColor: "white",
            indexLabelFontWeight: 200,
            indexLabelFontFamily: "Verdana",
            color: "#62C9C3",
            type: "bar",
            dataPoints: data
        }
        ]
    });
    chart.render();
}

window.onload = function () {
  let historyData = [];
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
    for(let i = 4; i >= 0; --i){
      historyData.push({y: sortedDomainMap[i][1], label: sortedDomainMap[i][0]});
    }
    renderData(historyData);
  });
}