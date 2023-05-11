// Create my own color theme
function am4themes_myTheme(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color("#f73100")
    ];
  }
}

// Themes begin
am4core.useTheme(am4themes_myTheme);
am4core.useTheme(am4themes_animated);

// Create map instance
var chart = am4core.create("heatchartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_usaLow;

// Set projection
chart.projection = new am4maps.projections.AlbersUsa();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

//Set min/max fill color for each area
polygonSeries.heatRules.push({
  property: "fill",
  // dataField: "value",
  target: polygonSeries.mapPolygons.template,
  max: chart.colors.getIndex(1).brighten(7),
  min: chart.colors.getIndex(1).brighten(-0.3)
});

// polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
//   heatLegend.showValue(ev.target.dataItem.get("value"));
// });

// Make map load polygon data (state shapes and names) from GeoJSON
polygonSeries.useGeodata = true;

// Set up data source
// polygonSeries.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_web.github.io/main/data/state_index.json";
polygonSeries.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_twitter.github.io/main/data/state_index.json";
polygonSeries.dataSource.parser = new am4core.JSONParser();
polygonSeries.dataSource.parser.options.useColumnNames = true;

// Set up heat legend
let heatLegend = chart.createChild(am4maps.HeatLegend);
heatLegend.series = polygonSeries;
heatLegend.align = "right";
heatLegend.valign = "bottom";
heatLegend.width = am4core.percent(20);
heatLegend.marginRight = am4core.percent(4);
heatLegend.minValue = 0;
heatLegend.maxValue = 100;

// Set up custom heat map legend labels using axis ranges
var minRange = heatLegend.valueAxis.axisRanges.create();
minRange.value = heatLegend.minValue;
minRange.label.text = "0%";
var maxRange = heatLegend.valueAxis.axisRanges.create();
maxRange.value = heatLegend.maxValue;
maxRange.label.text = "100%";

// Blank out internal heat legend value axis labels
heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
  return "";
});

// Configure series tooltip
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}: {value}";
polygonTemplate.nonScalingStroke = true;
polygonTemplate.strokeWidth = 0.5;

// Start info with US averages
var info = document.getElementById("info");
info.innerHTML = "<h3> United States Average </h3>";
info.innerHTML += "Average number of HIV Testing Tweets: " + 7776.94 +
  "<br>" + "Average number of HIV Prep Tweets: " + 1964.26 +
  "<br>" + "Total: " + 9741.20;

// Onclick for states, open its stats
polygonTemplate.events.on("hit", function(ev) {
  var data = ev.target.dataItem.dataContext;
  var info = document.getElementById("info");
  info.innerHTML = "<h3>" + data.name + "<br>" + " (" + data.id + ")</h3>";
  if (data.id) {
    info.innerHTML += "Average number of HIV-Testing Tweets: " + data.HIV_Testing +
    "<br>" + "Average number of HIV-PrEP Tweets: " + data.HIV_Prep +
    "<br>" + "Average Total: " + data.value;
  } else {
    info.innerHTML += "<i>No description provided.</i>"
  }
});

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#042039");