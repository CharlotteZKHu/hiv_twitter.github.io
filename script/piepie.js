am4core.ready(function() {

// Themes begin
// am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// Themes end

var container = am4core.create("pie_chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "horizontal";


var chart = container.createChild(am4charts.PieChart);

// Add data
chart.data = [
    {
        "index": "United States",
        "total": "566343",
        "subData": [{name: "HIV Testing",value: 449489 }, { name: "HIV Prep", value: 116854 }]
    },
    {
        "index": "United Kingdom",
        "total": "109060",
        "subData": [{name: "HIV Testing",value: 83195 }, { name: "HIV Prep", value: 25865 }]
    },
    {
        "index": "Nigeria",
        "total": "53386",
        "subData": [{name: "HIV Testing",value: 51138 }, { name: "HIV Prep", value: 2248 }]
    },
    {
        "index": "South Africa",
        "total": "47129",
        "subData": [{name: "HIV Testing",value: 40970 }, { name: "HIV Prep", value: 6159 }]
    },
    {
        "index": "Georgia",
        "total": "32134",
        "subData": [{name: "HIV Testing",value: 27300 }, { name: "HIV Prep", value: 4834 }]
    },
    {
        "index": "Canada",
        "total": "24953",
        "subData": [{name: "HIV Testing",value: 19371 }, { name: "HIV Prep", value: 5582 }]
    },
    {
        "index": "Kenya",
        "total": "24796",
        "subData": [{name: "HIV Testing",value: 20842 }, { name: "HIV Prep", value: 3954 }]
    },
    {
        "index": "India",
        "total": "15554",
        "subData": [{name: "HIV Testing",value: 13930 }, { name: "HIV Prep", value: 1624 }]
    },
    {
        "index": "Uganda",
        "total": "14189",
        "subData": [{name: "HIV Testing",value: 13409 }, { name: "HIV Prep", value: 780 }]
    },
    {
        "index": "Philippines",
        "total": "13315",
        "subData": [{name: "HIV Testing",value: 12095 }, { name: "HIV Prep", value: 1220 }]
    }
];

// Add and configure Series
var pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "total";
pieSeries.dataFields.category = "index";
pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
//pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

pieSeries.slices.template.events.on("hit", function(event) {
  selectSlice(event.target.dataItem);
})

var chart2 = container.createChild(am4charts.PieChart);
chart2.width = am4core.percent(30);
chart2.radius = am4core.percent(80);

// Add and configure Series
var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
pieSeries2.dataFields.value = "value";
pieSeries2.dataFields.category = "name";
pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
// pieSeries2.labels.template.radius = am4core.percent(50);
pieSeries2.labels.template.inside = true;
// pieSeries2.labels.template.fill = am4core.color("#c4ac6a");
// pieSeries2.labels.template.disabled = true;
pieSeries2.ticks.template.disabled = true;
pieSeries2.alignLabels = false;
pieSeries2.events.on("positionchanged", updateLines);

var interfaceColors = new am4core.InterfaceColorSet();

var line1 = container.createChild(am4core.Line);
line1.strokeDasharray = "2,2";
line1.strokeOpacity = 0.5;
line1.stroke = interfaceColors.getFor("alternativeBackground");
line1.isMeasured = false;

var line2 = container.createChild(am4core.Line);
line2.strokeDasharray = "2,2";
line2.strokeOpacity = 0.5;
line2.stroke = interfaceColors.getFor("alternativeBackground");
line2.isMeasured = false;

var selectedSlice;

function selectSlice(dataItem) {

  selectedSlice = dataItem.slice;

  var fill = selectedSlice.fill;

  var count = dataItem.dataContext.subData.length;
  pieSeries2.colors.list = [];
  for (var i = 0; i < count; i++) {
    pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
  }

  chart2.data = dataItem.dataContext.subData;
  pieSeries2.appear();

  var middleAngle = selectedSlice.middleAngle;
  var firstAngle = pieSeries.slices.getIndex(0).startAngle;
  var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
  animation.events.on("animationprogress", updateLines);

  selectedSlice.events.on("transformed", updateLines);

//  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
//  animation.events.on("animationprogress", updateLines)
}


function updateLines() {
  if (selectedSlice) {
    var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
    var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

    p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
    p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

    var p21 = { x: 0, y: -pieSeries2.pixelRadius };
    var p22 = { x: 0, y: pieSeries2.pixelRadius };

    p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
    p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

    line1.x1 = p11.x;
    line1.x2 = p21.x;
    line1.y1 = p11.y;
    line1.y2 = p21.y;

    line2.x1 = p12.x;
    line2.x2 = p22.x;
    line2.y1 = p12.y;
    line2.y2 = p22.y;
  }
}

chart.events.on("datavalidated", function() {
  setTimeout(function() {
    selectSlice(pieSeries.dataItems.getIndex(0));
  }, 1000);
});


}); // end am4core.ready()

