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

    var data = {"OkPercent": 42.74285714285714, "KoPercent": 57.25714285714286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST - Browse Category (Phones)"], "isController": false}, {"data": [0.858, 500, 1500, "GET - Home Page"], "isController": false}, {"data": [0.0, 500, 1500, "POST - Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "POST - User Login"], "isController": false}, {"data": [0.962, 500, 1500, "GET - View Cart Page"], "isController": false}, {"data": [0.0, 500, 1500, "POST - Checkout Place Order"], "isController": false}, {"data": [0.0, 500, 1500, "TX - Full Purchase Flow"], "isController": true}, {"data": [0.964, 500, 1500, "GET - Product Details Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1750, 1002, 57.25714285714286, 319.1114285714285, 134, 2599, 257.0, 505.0, 644.0, 1196.49, 14.342851522801036, 54.62986446773678, 4.932356166811461], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST - Browse Category (Phones)", 250, 250, 100.0, 300.82800000000003, 231, 802, 253.0, 394.70000000000005, 509.84999999999985, 698.1100000000013, 2.3154579975919236, 1.1034604519774012, 0.7642820343613967], "isController": false}, {"data": ["GET - Home Page", 250, 2, 0.8, 433.8840000000002, 135, 2599, 278.5, 1039.6, 1211.8999999999996, 1944.3300000000047, 2.2696529246747588, 19.534734271872644, 0.6804525858155771], "isController": false}, {"data": ["POST - Add to Cart", 250, 250, 100.0, 324.2199999999998, 231, 1067, 267.5, 510.8, 558.0499999999997, 856.5800000000004, 2.3223409196470044, 1.1158848118903855, 0.8595382895959126], "isController": false}, {"data": ["POST - User Login", 250, 250, 100.0, 311.4720000000003, 232, 868, 268.5, 453.8, 523.9, 659.6800000000003, 2.309767544994272, 1.1008207758971136, 0.8345839762186333], "isController": false}, {"data": ["GET - View Cart Page", 250, 0, 0.0, 283.61600000000027, 134, 1291, 253.0, 472.9000000000001, 612.3999999999996, 1048.8400000000029, 2.32272929983648, 20.118410562146945, 0.694096841552698], "isController": false}, {"data": ["POST - Checkout Place Order", 250, 250, 100.0, 296.672, 232, 834, 249.0, 418.00000000000006, 510.9, 794.4400000000005, 2.3278334388617825, 1.1070848483649298, 1.0275202288725838], "isController": false}, {"data": ["TX - Full Purchase Flow", 250, 250, 100.0, 2233.780000000001, 1372, 5254, 2124.0, 3158.4, 3353.2999999999997, 4277.01, 2.229554980825827, 59.44438618957906, 5.367043972398109], "isController": true}, {"data": ["GET - Product Details Page", 250, 0, 0.0, 283.0880000000001, 134, 952, 256.5, 467.70000000000005, 537.6499999999999, 734.49, 2.3196043682789464, 17.36058960283734, 0.7090196946008889], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 2,599 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0998003992015968, 0.05714285714285714], "isController": false}, {"data": ["404/Not Found", 1000, 99.8003992015968, 57.142857142857146], "isController": false}, {"data": ["The operation lasted too long: It took 2,208 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.0998003992015968, 0.05714285714285714], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1750, 1002, "404/Not Found", 1000, "The operation lasted too long: It took 2,599 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,208 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST - Browse Category (Phones)", 250, 250, "404/Not Found", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET - Home Page", 250, 2, "The operation lasted too long: It took 2,599 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,208 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["POST - Add to Cart", 250, 250, "404/Not Found", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST - User Login", 250, 250, "404/Not Found", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST - Checkout Place Order", 250, 250, "404/Not Found", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
