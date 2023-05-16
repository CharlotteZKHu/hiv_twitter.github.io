// Create my own color theme
function am4themes_myTheme_t(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color("#f73100")
    ];
  }
}

// Themes begin
// am4core.useTheme(am4themes_myTheme_t);
am4core.useTheme(am4themes_animated);

// Create map instance
var chart_t = am4core.create("heatTestdiv", am4maps.MapChart);

// Set map definition
chart_t.geodata = am4geodata_usaLow;

// Set projection
chart_t.projection = new am4maps.projections.AlbersUsa();

// Create map polygon series
var polygonSeries_t = chart_t.series.push(new am4maps.MapPolygonSeries());

//Set min/max fill color for each area
polygonSeries_t.heatRules.push({
  property: "fill",
  // dataField: "value",
  target: polygonSeries_t.mapPolygons.template,
  max: chart_t.colors.getIndex(1).brighten(1),
  min: chart_t.colors.getIndex(1).brighten(-0.6)
});

// polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
//   heatLegend.showValue(ev.target.dataItem.get("value"));
// });

// Make map load polygon data (state shapes and names) from GeoJSON
polygonSeries_t.useGeodata = true;

// Set up data source
// polygonSeries.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_web.github.io/main/data/state_index.json";
polygonSeries_t.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_twitter.github.io/main/data/state_index_test.json";
polygonSeries_t.dataSource.parser = new am4core.JSONParser();
polygonSeries_t.dataSource.parser.options.useColumnNames = true;

// Set up heat legend
let heatLegend_t = chart_t.createChild(am4maps.HeatLegend);
heatLegend_t.series = polygonSeries_t;
heatLegend_t.align = "right";
heatLegend_t.valign = "bottom";
heatLegend_t.width = am4core.percent(20);
heatLegend_t.marginRight = am4core.percent(4);
heatLegend_t.minValue = 0;
heatLegend_t.maxValue = 100;

// Set up custom heat map legend labels using axis ranges
var minRange_t = heatLegend_t.valueAxis.axisRanges.create();
minRange_t.value = heatLegend_t.minValue;
minRange_t.label.text = "0%";
var maxRange_t = heatLegend_t.valueAxis.axisRanges.create();
maxRange_t.value = heatLegend_t.maxValue;
maxRange_t.label.text = "100%";

// Blank out internal heat legend value axis labels
heatLegend_t.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
  return "";
});

// Configure series tooltip
var polygonTemplate_t = polygonSeries_t.mapPolygons.template;
polygonTemplate_t.tooltipText = "{name}: {value}";
polygonTemplate_t.nonScalingStroke = true;
polygonTemplate_t.strokeWidth = 0.5;

// Onclick for states, open its stats
polygonTemplate_t.events.on("hit", function(ev) {
  var data_t = ev.target.dataItem.dataContext;
  var info_t = document.getElementById("info_t");
  info_t.innerHTML = "<h3>" + data_t.name + "<br>" + " (" + data_t.id + ")</h3>";
  if (data_t.id) {
    info_t.innerHTML += "<b>" + "Average number of HIV Testing Tweets: " + data_t.value + "</b>" + 
    "<br>" + "Average number of HIV PrEP Tweets: " + data_t.HIV_Prep +
    "<br>" + "Average Total: " + data_t.total;
  } else {
    info_t.innerHTML += "<i>No description provided.</i>"
  }
});

// Start info with US averages
var info_t = document.getElementById("info_t");
info_t.innerHTML = "<h3> United States Average </h3>";
info_t.innerHTML += "<b>" + "Average number of HIV Testing Tweets: " + 7776.94 + "</b>" +
  "<br>" + "Average number of HIV PrEP Tweets: " + 1964.26 +
  "<br>" + "Total: " + 9741.20;

// Onclick for states, open its stats
polygonTemplate.events.on("hit", function(ev) {
  var data_t = ev.target.dataItem.dataContext;
  var info_t = document.getElementById("info");
  info_t.innerHTML = "<h3>" + data_t.name + "<br>" + " (" + data_t.id + ")</h3>";
  if (data_t.id) {
    info_t.innerHTML += "<b>" + "Average number of HIV Testing Tweets: " + data_t.value + "</b>" +
    "<br>" + "Average number of HIV PrEP Tweets: " + data_t.HIV_Prep +
    "<br>" + "Average Total: " + data_t.total;
  } else {
    info_t.innerHTML += "<i>No description provided.</i>"
  }
});

// Create hover state and set alternative fill color
var hs_t = polygonTemplate_t.states.create("hover");
hs_t.properties.fill = am4core.color("#042039");