/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 71.18571428571428, "KoPercent": 28.814285714285713};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5691875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.923, 500, 1500, "POST - Browse Category (Phones)"], "isController": false}, {"data": [0.7885, 500, 1500, "GET - Home Page"], "isController": false}, {"data": [0.9335, 500, 1500, "POST - Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "POST - User Login"], "isController": false}, {"data": [0.9625, 500, 1500, "GET - View Cart Page"], "isController": false}, {"data": [0.0, 500, 1500, "POST - Checkout Place Order"], "isController": false}, {"data": [0.0, 500, 1500, "TX - Full Purchase Flow"], "isController": true}, {"data": [0.946, 500, 1500, "GET - Product Details Page"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7000, 2017, 28.814285714285713, 383.9158571428584, 133, 5081, 282.0, 653.0, 892.8499999999995, 1486.8499999999967, 22.373795810346923, 122.06660122164921, 7.694113654088332], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST - Browse Category (Phones)", 1000, 1, 0.1, 370.3600000000004, 245, 2131, 282.0, 620.9, 774.6499999999995, 1125.91, 3.2622382869334308, 6.858996172578929, 1.0767934970541988], "isController": false}, {"data": ["GET - Home Page", 1000, 14, 1.4, 487.4930000000004, 133, 2812, 396.0, 1007.6999999999999, 1353.7499999999995, 2155.4500000000007, 3.2498236970644343, 30.749092359786356, 0.9743123779284973], "isController": false}, {"data": ["POST - Add to Cart", 1000, 1, 0.1, 340.22200000000015, 241, 2299, 265.0, 583.0, 666.8999999999999, 1028.6800000000003, 3.261238226930001, 0.8408134588040387, 1.2070403203188187], "isController": false}, {"data": ["POST - User Login", 1000, 1000, 100.0, 562.5180000000004, 242, 5081, 515.0, 996.9, 1302.0, 2197.7200000000003, 3.2595692805152727, 0.7894651332022987, 1.1777740564361825], "isController": false}, {"data": ["GET - View Cart Page", 1000, 1, 0.1, 252.53599999999992, 133, 2975, 205.5, 394.79999999999995, 605.8999999999999, 866.8800000000001, 3.256427373528502, 28.04482319634629, 0.973112086230197], "isController": false}, {"data": ["POST - Checkout Place Order", 1000, 1000, 100.0, 333.0050000000002, 234, 1752, 255.0, 562.4999999999999, 633.7999999999997, 1011.8600000000001, 3.2565440252186773, 1.3865881066127383, 1.4374588861316815], "isController": false}, {"data": ["TX - Full Purchase Flow", 1000, 1000, 100.0, 2687.4110000000005, 1425, 7917, 2445.0, 3974.5999999999995, 4502.199999999995, 5759.71, 3.227138947694532, 123.24601531539635, 7.768454595768575], "isController": true}, {"data": ["GET - Product Details Page", 1000, 0, 0.0, 341.2770000000002, 135, 1726, 295.0, 513.5999999999999, 734.8499999999998, 973.9300000000001, 3.260802222562795, 55.72132078590225, 0.9967100543575731], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 2,597 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,631 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,299 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 3,440 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,170 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["404/Not Found", 1000, 49.578582052553294, 14.285714285714286], "isController": false}, {"data": ["The operation lasted too long: It took 2,550 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,039 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,229 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,198 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.0991571641051066, 0.02857142857142857], "isController": false}, {"data": ["Login response missing Auth token", 987, 48.934060485870106, 14.1], "isController": false}, {"data": ["The operation lasted too long: It took 3,770 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,323 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 5,081 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,032 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,058 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,279 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,975 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 5,039 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,812 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,101 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,324 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,131 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,156 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,662 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,532 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,174 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,347 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,135 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,049 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}, {"data": ["The operation lasted too long: It took 2,436 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0495785820525533, 0.014285714285714285], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7000, 2017, "404/Not Found", 1000, "Login response missing Auth token", 987, "The operation lasted too long: It took 2,198 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 2,597 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,631 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST - Browse Category (Phones)", 1000, 1, "The operation lasted too long: It took 2,131 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET - Home Page", 1000, 14, "The operation lasted too long: It took 2,279 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,597 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,812 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,101 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,324 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, {"data": ["POST - Add to Cart", 1000, 1, "The operation lasted too long: It took 2,299 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST - User Login", 1000, 1000, "Login response missing Auth token", 987, "The operation lasted too long: It took 2,198 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 5,039 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 3,440 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,170 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, {"data": ["GET - View Cart Page", 1000, 1, "The operation lasted too long: It took 2,975 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST - Checkout Place Order", 1000, 1000, "404/Not Found", 1000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
