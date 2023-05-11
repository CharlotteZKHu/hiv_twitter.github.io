// Create my own color theme
function am4themes_myTheme_p(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color("#f73100")
    ];
  }
}

// Themes begin
// am4core.useTheme(am4themes_myTheme_p);
am4core.useTheme(am4themes_animated);

// Create map instance
var chart_p = am4core.create("heatPrEPdiv", am4maps.MapChart);

// Set map definition
chart_p.geodata = am4geodata_usaLow;

// Set projection
chart_p.projection = new am4maps.projections.AlbersUsa();

// Create map polygon series
var polygonSeries_p = chart_p.series.push(new am4maps.MapPolygonSeries());

//Set min/max fill color for each area
polygonSeries_p.heatRules.push({
  property: "fill",
  // dataField: "value",
  target: polygonSeries_p.mapPolygons.template,
  max: chart_p.colors.getIndex(1).brighten(1),
  min: chart_p.colors.getIndex(1).brighten(-0.3)
});

// polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
//   heatLegend.showValue(ev.target.dataItem.get("value"));
// });

// Make map load polygon data (state shapes and names) from GeoJSON
polygonSeries_p.useGeodata = true;

// Set up data source
// polygonSeries.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_web.github.io/main/data/state_index.json";
polygonSeries_p.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_twitter.github.io/main/data/state_index_PrEP.json";
polygonSeries_p.dataSource.parser = new am4core.JSONParser();
polygonSeries_p.dataSource.parser.options.useColumnNames = true;

// Set up heat legend
let heatLegend_p = chart_p.createChild(am4maps.HeatLegend);
heatLegend_p.series = polygonSeries_p;
heatLegend_p.align = "right";
heatLegend_p.valign = "bottom";
heatLegend_p.width = am4core.percent(20);
heatLegend_p.marginRight = am4core.percent(4);
heatLegend_p.minValue = 0;
heatLegend_p.maxValue = 100;

// Set up custom heat map legend labels using axis ranges
var minRange_p = heatLegend_p.valueAxis.axisRanges.create();
minRange_p.value = heatLegend_p.minValue;
minRange_p.label.text = "0%";
var maxRange_p = heatLegend_p.valueAxis.axisRanges.create();
maxRange_p.value = heatLegend_p.maxValue;
maxRange_p.label.text = "100%";

// Blank out internal heat legend value axis labels
heatLegend_p.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
  return "";
});

// Configure series tooltip
var polygonTemplate_p = polygonSeries_p.mapPolygons.template;
polygonTemplate_p.tooltipText = "{name}: {value}";
polygonTemplate_p.nonScalingStroke = true;
polygonTemplate_p.strokeWidth = 0.5;

// Onclick for states, open its stats
polygonTemplate_p.events.on("hit", function(ev) {
  var data_p = ev.target.dataItem.dataContext;
  var info_p = document.getElementById("info");
  // info.innerHTML = "<h3>" + data.name + "<br>" + " (" + data.id + ")</h3>";
  // if (data.id) {
  //   info.innerHTML += "Average number of HIV Testing Tweets: " + data.HIV_Testing +
  //   "<br>" + "Average number of HIV Prep Tweets: " + data.HIV_Prep +
  //   "<br>" + "Average Total: " + data.value;
  // } else {
  //   info.innerHTML += "<i>No description provided.</i>"
  // }
});

// Start info with US averages
// var info = document.getElementById("info");
// info.innerHTML = "<h3> United States Average </h3>";
// info.innerHTML += "Average number of HIV Testing Tweets: " + 7776.94 +
//   "<br>" + "Average number of HIV Prep Tweets: " + 1964.26 +
//   "<br>" + "Total: " + 9741.20;

// Onclick for states, open its stats
// polygonTemplate.events.on("hit", function(ev) {
//   var data = ev.target.dataItem.dataContext;
//   var info = document.getElementById("info");
//   info.innerHTML = "<h3>" + data.name + "<br>" + " (" + data.id + ")</h3>";
//   if (data.id) {
//     info.innerHTML += "Average number of HIV Testing Tweets: " + data.HIV_Testing +
//     "<br>" + "Average number of HIV Prep Tweets: " + data.HIV_Prep +
//     "<br>" + "Average Total: " + data.value;
//   } else {
//     info.innerHTML += "<i>No description provided.</i>"
//   }
// });

// Create hover state and set alternative fill color
var hs_p = polygonTemplate_p.states.create("hover");
hs_p.properties.fill = am4core.color("#042039");