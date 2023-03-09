am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("globe_chartdiv", am4maps.MapChart);
var interfaceColors = new am4core.InterfaceColorSet();

try {
    chart.geodata = am4geodata_worldLow;
}
catch (e) {
    chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
}


var label = chart.createChild(am4core.Label)
// label.text = "12 months (3/7/2019 data) rolling measles\nincidence per 1'000'000 total population. \n Bullet size uses logarithmic scale.";
label.text = "Average number of HIV Testing Tweets: 4580.08 \n Average number of HIV Prep Tweets: 1116.60 \n Average Total: 5610.31";
// var info = document.getElementById("info");
// info.innerHTML = "<h3> United States Average </h3>";
// info.innerHTML += "Average number of HIV Testing Tweets: " + 7776.94 +
//   "<br>" + "Average number of HIV Prep Tweets: " + 1964.26 +
//   "<br>" + "Total: " + 9741.20;
// label.text += "Average number of HIV Testing Tweets: " + 7776.94 +
// "<br>" + "Average number of HIV Prep Tweets: " + 1964.26 +
// "<br>" + "Average Total: " + 9741.20;
label.fontSize = 18;
label.align = "left";
label.valign = "up"
label.fill = am4core.color("#927459");
label.background = new am4core.RoundedRectangle()
label.background.cornerRadius(10,10,10,10);
label.padding(10,10,10,10);
label.marginLeft = 30;
label.marginBottom = 30;
label.background.strokeOpacity = 0.3;
label.background.stroke =am4core.color("#927459");
label.background.fill = am4core.color("#f9e3ce");
label.background.fillOpacity = 0.6;

// var dataSource = chart.createChild(am4core.TextLink)
// dataSource.text = "Data source: WHO";
// dataSource.fontSize = 12;
// dataSource.align = "left";
// dataSource.valign = "top"
// dataSource.url = "https://www.who.int/immunization/monitoring_surveillance/burden/vpd/surveillance_type/active/measles_monthlydata/en/"
// dataSource.urlTarget = "_blank";
// dataSource.fill = am4core.color("#927459");
// dataSource.padding(10,10,10,10);
// dataSource.marginLeft = 30;
// dataSource.marginTop = 30;

// Set projection
chart.projection = new am4maps.projections.Orthographic();
chart.panBehavior = "rotateLongLat";
chart.padding(20,20,20,20);

// Add zoom control
chart.zoomControl = new am4maps.ZoomControl();

var homeButton = new am4core.Button();
homeButton.events.on("hit", function(){
  chart.goHome();
});

homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 30;
homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 10;
homeButton.parent = chart.zoomControl;
homeButton.insertBefore(chart.zoomControl.plusButton);

chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#bfa58d");
chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
chart.deltaLongitude = 20;
chart.deltaLatitude = -20;

// limits vertical rotation
chart.adapter.add("deltaLatitude", function(delatLatitude){
    return am4core.math.fitToRange(delatLatitude, -90, 90);
})

// Create map polygon series

var shadowPolygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
shadowPolygonSeries.geodata = am4geodata_continentsLow;

try {
    shadowPolygonSeries.geodata = am4geodata_continentsLow;
}
catch (e) {
    shadowPolygonSeries.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
}

shadowPolygonSeries.useGeodata = true;
shadowPolygonSeries.dx = 2;
shadowPolygonSeries.dy = 2;
shadowPolygonSeries.mapPolygons.template.fill = am4core.color("#000");
shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
shadowPolygonSeries.fillOpacity = 0.1;
shadowPolygonSeries.fill = am4core.color("#000");


// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;

polygonSeries.calculateVisualCenter = true;
polygonSeries.tooltip.background.fillOpacity = 0.2;
polygonSeries.tooltip.background.cornerRadius = 20;

var template = polygonSeries.mapPolygons.template;
template.nonScalingStroke = true;
template.fill = am4core.color("#f9e3ce");
template.stroke = am4core.color("#e2c9b0");

polygonSeries.calculateVisualCenter = true;
template.propertyFields.id = "id";
template.tooltipPosition = "fixed";
template.fillOpacity = 1;

template.events.on("over", function (event) {
  if (event.target.dummyData) {
    event.target.dummyData.isHover = true;
  }
})
template.events.on("out", function (event) {
  if (event.target.dummyData) {
    event.target.dummyData.isHover = false;
  }
})

var hs = polygonSeries.mapPolygons.template.states.create("hover");
hs.properties.fillOpacity = 1;
hs.properties.fill = am4core.color("#deb7ad");


var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
graticuleSeries.fitExtent = false;
graticuleSeries.mapLines.template.strokeOpacity = 0.2;
graticuleSeries.mapLines.template.stroke = am4core.color("#fff");


var measelsSeries = chart.series.push(new am4maps.MapPolygonSeries())
measelsSeries.tooltip.background.fillOpacity = 0;
measelsSeries.tooltip.background.cornerRadius = 20;
measelsSeries.tooltip.autoTextColor = false;
measelsSeries.tooltip.label.fill = am4core.color("#000");
measelsSeries.tooltip.dy = -5;

var measelTemplate = measelsSeries.mapPolygons.template;
measelTemplate.fill = am4core.color("#bf7569");
measelTemplate.strokeOpacity = 0;
measelTemplate.fillOpacity = 0.75;
measelTemplate.tooltipPosition = "fixed";



var hs2 = measelsSeries.mapPolygons.template.states.create("hover");
hs2.properties.fillOpacity = 1;
hs2.properties.fill = am4core.color("#86240c");

polygonSeries.events.on("inited", function () {
  polygonSeries.mapPolygons.each(function (mapPolygon) {
    var count = data[mapPolygon.id];

    if (count > 0) {
      var polygon = measelsSeries.mapPolygons.create();
      polygon.multiPolygon = am4maps.getCircle(mapPolygon.visualLongitude, mapPolygon.visualLatitude, Math.max(0.2, Math.log(count) * Math.LN10 / 10));
      polygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": " + count;
      mapPolygon.dummyData = polygon;
      polygon.events.on("over", function () {
        mapPolygon.isHover = true;
      })
      polygon.events.on("out", function () {
        mapPolygon.isHover = false;
      })
    }
    else {
      mapPolygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": no data";
      mapPolygon.fillOpacity = 0.9;
    }

  })
})

var data = {
    "AF": "46",
    "AL": "23",
    "DZ": "107",
    "AD": "6",
    "AO": "47",
    "AQ": "103",
    "AG": "78",
    "AR": "1260",
    "AM": "138",
    "AW": "12",
    "AU": "9711",
    "AT": "1380",
    "AZ": "19",
    "BH": "83",
    "BD": "535",
    "BB": "320",
    "BY": "56",
    "BE": "1338",
    "BZ": "59",
    "BJ": "8",
    "BM": "91",
    "BO": "27",
    "BA": "31",
    "BW": "6031",
    "BR": "921",
    "IO": "25",
    "BN": "60",
    "BG": "68",
    "KH": "254",
    "CM": "585",
    "CA": "24953",
    "CV": "116",
    "KY": "93",
    "CL": "280",
    "CN": "1195",
    "CX": "5",
    "CO": "385",
    "CR": "115",
    "HR": "39",
    "CU": "62",
    "CY": "141",
    "CZ": "36",
    "CG": "21",
    "DK": "668",
    "DJ": "21",
    "DM": "42",
    "DO": "222",
    "EC": "129",
    "EG": "571",
    "SV": "71",
    "ER": "19",
    "EE": "277",
    "ET": "666",
    "FJ": "94",
    "FI": "363",
    "FR": "2615",
    "PF": "30",
    "GE": "32134",
    "DE": "2777",
    "GH": "6024",
    "GR": "567",
    "GL": "16",
    "GD": "86",
    "GP": "36",
    "GT": "48",
    "GY": "330",
    "HT": "197",
    "HN": "38",
    "HK": "478",
    "HU": "140",
    "IS": "164",
    "IN": "15554",
    "ID": "3800",
    "IR": "69",
    "IQ": "90",
    "IE": "5790",
    "IL": "285",
    "IT": "1241",
    "JM": "935",
    "JP": "1463",
    "JO": "2272",
    "KZ": "324",
    "KE": "24796",
    "KW": "113",
    "KG": "12",
    "LV": "7",
    "LB": "146",
    "LS": "477",
    "LY": "52",
    "LT": "16",
    "LU": "107",
    "MO": "19",
    "MK": "14",
    "MG": "147",
    "MW": "1270",
    "MY": "3293",
    "MV": "252",
    "MT": "286",
    "MQ": "4",
    "MU": "43",
    "MX": "1037",
    "MD": "64",
    "MC": "14",
    "MN": "57",
    "ME": "31",
    "MA": "89",
    "MZ": "72",
    "MM": "75",
    "NA": "1777",
    "NP": "488",
    "NL": "1152",
    "NZ": "649",
    "NI": "46",
    "NG": "53386",
    "KP": "42",
    "NO": "528",
    "OM": "100",
    "PK": "3504",
    "PS": "2",
    "PA": "159",
    "PG": "106",
    "PY": "22",
    "PE": "116",
    "PH": "13315",
    "PL": "321",
    "PT": "665",
    "QA": "215",
    "RE": "7",
    "RO": "209",
    "RU": "422",
    "RW": "1044",
    "KN": "1",
    "VC": "9",
    "WS": "12",
    "SA": "678",
    "SN": "104",
    "RS": "70",
    "SC": "56",
    "SL": "103",
    "SG": "2535",
    "SK": "247",
    "SI": "44",
    "SO": "84",
    "ZA": "47129",
    "GS": "10",
    "KR": "233",
    "ES": "2022",
    "LK": "511",
    "LC": "104",
    "SD": "110",
    "SR": "22",
    "SZ": "472",
    "SE": "1827",
    "CH": "6752",
    "SY": "22",
    "TW": "204",
    "TJ": "6",
    "TZ": "1730",
    "TH": "2013",
    "BS": "532",
    "GM": "46",
    "TT": "720",
    "TN": "2848",
    "TR": "380",
    "TM": "31",
    "TC": "62",
    "UG": "14189",
    "UA": "420",
    "AE": "857",
    "GB": "109060",
    "US": "566343",
    "UY": "31",
    "UZ": "40",
    "VE": "786",
    "VN": "329",
    "YE": "42",
    "ZM": "2561",
    "ZW": "5180"
}

// var data = {
//   "AL": 504.38,
//   "AM": 6.5,
//   "AO": 2.98,
//   "AR": 0.32,
//   "AT": 10.9,
//   "AU": 5.02,
//   "AZ": 17.38,
//   "BA": 24.45,
//   "BD": 13.4,
//   "BE": 12.06,
//   "BF": 93.37,
//   "BG": 1.68,
//   "BI": 0.95,
//   "BJ": 93.36,
//   "BR": 49.42,
//   "BT": 10.03,
//   "BY": 26.16,
//   "CA": 0.96,
//   "CD": 69.71,
//   "CF": 4.57,
//   "CG": 19.7,
//   "CH": 6.19,
//   "CI": 14.1,
//   "CL": 1.4,
//   "CM": 41.26,
//   "CN": 2.6,
//   "CO": 4.48,
//   "CY": 7.69,
//   "CZ": 23.09,
//   "DK": 1.58,
//   "EE": 9.91,
//   "EG": 0.63,
//   "ES": 4.96,
//   "FI": 3.27,
//   "FR": 43.26,
//   "GA": 3.03,
//   "GB": 14.3,
//   "GE": 809.09,
//   "GH": 39.78,
//   "GM": 2.45,
//   "GN": 45.98,
//   "GQ": 23.74,
//   "GR": 154.42,
//   "HR": 5.46,
//   "HU": 1.44,
//   "ID": 16.87,
//   "IE": 17.56,
//   "IL": 412.24,
//   "IN": 47.85,
//   "IQ": 12.96,
//   "IR": 1.13,
//   "IT": 44.29,
//   "JP": 3.27,
//   "KE": 16.8,
//   "KG": 253.37,
//   "KH": 0.44,
//   "KM": 1.26,
//   "KZ": 116.3,
//   "LA": 1.33,
//   "LK": 0.53,
//   "LR": 692.27,
//   "LS": 5.9,
//   "LT": 14.44,
//   "LU": 6.95,
//   "LV": 6.09,
//   "MA": 0.2,
//   "MD": 83.75,
//   "ME": 319.75,
//   "MG": 2386.35,
//   "MK": 28.83,
//   "ML": 48.68,
//   "MM": 40.31,
//   "MN": 0.66,
//   "MR": 14.65,
//   "MT": 11.65,
//   "MV": 9.35,
//   "MX": 0.04,
//   "MY": 86.41,
//   "MZ": 13.49,
//   "NA": 12.9,
//   "NE": 80.88,
//   "NG": 31.44,
//   "NL": 1.47,
//   "NO": 2.47,
//   "NP": 10.8,
//   "NZ": 9.23,
//   "PE": 1.29,
//   "PK": 159.14,
//   "PL": 8.24,
//   "PT": 16.68,
//   "RO": 63.05,
//   "RS": 473.46,
//   "RU": 14.24,
//   "RW": 5.45,
//   "SE": 2.64,
//   "SG": 8.18,
//   "SI": 3.37,
//   "SK": 112.78,
//   "SN": 3.37,
//   "SO": 8.03,
//   "SS": 19.3,
//   "TD": 75.63,
//   "TG": 34.84,
//   "TH": 81.02,
//   "TL": 9.46,
//   "TN": 7.8,
//   "TR": 7.08,
//   "UA": 1439.02,
//   "UG": 62.55,
//   "US": 1.32,
//   "UZ": 0.99,
//   "VE": 179.55,
//   "ZA": 3.09,
//   "ZM": 9.82,
//   "ZW": 0.06
// }


}); // end am4core.ready()
