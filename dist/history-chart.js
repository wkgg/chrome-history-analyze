"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function renderData(data) {
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
            gridThickness: 0
        },
        axisX: {
            tickThickness: 0,
            lineThickness: 0,
            labelFontSize: 18,
            labelFontColor: "#515151"
        },
        backgroundColor: "#ffffff",
        data: [{
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
        }]
    });
    chart.render();
}

window.onload = function () {
    var historyData = [];
    chrome.history.search({ text: "", startTime: 1, maxResults: 1000000 }, function (results) {
        var domainMap = new Map();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var result = _step.value;

                var domain = new URI(result.url).domain();
                if (domainMap.has(domain)) {
                    domainMap.set(domain, domainMap.get(domain) + 1);
                } else {
                    domainMap.set(domain, 1);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var sortedDomainMap = [].concat(_toConsumableArray(domainMap.entries())).sort(function (a, b) {
            return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
        });
        for (var i = 4; i >= 0; --i) {
            historyData.push({ y: sortedDomainMap[i][1], label: sortedDomainMap[i][0], indexLabel: sortedDomainMap[i][1].toString() });
        }
        renderData(historyData);
    });
};
