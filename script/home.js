var d1 = new Date();
var d2 = new Date("2020/03/16");
var diff = Math.abs(d1 - d2);

function dhm(t) {
  var cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    d = Math.floor(t / cd),
    h = Math.floor((t - d * cd) / ch),
    m = Math.round((t - d * cd - h * ch) / 60000),
    pad = function(n) {
      return n < 10 ? '0' + n : n;
    };
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return [d];
}
document.getElementById("datedisplay").innerHTML = dhm(diff) + " days since the start of national social distancing in the United States (3/16/2020)";


am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Set up data source
chart.dataSource.url = "https://raw.githubusercontent.com/mdredze/covid19_social_mobility.github.io/master/data/home-index.json";
chart.dataSource.parser = new am4core.JSONParser();
chart.dataSource.parser.options.useColumnNames = true;

// Create axes
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "location";
categoryAxis.numberFormatter.numberFormat = "#";
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.cellStartLocation = 0.1;
categoryAxis.renderer.cellEndLocation = 0.9;

var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.opposite = true;
valueAxis.title.text = "distance (km)";

// Create series
function createSeries(field, name) {
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueX = field;
  series.dataFields.categoryY = "location";
  series.name = name;
  series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]km";
  series.columns.template.height = am4core.percent(100);
  series.sequencedInterpolation = true;

  var valueLabel = series.bullets.push(new am4charts.LabelBullet());
  //valueLabel.label.text = "{valueX}km";
  valueLabel.label.horizontalCenter = "left";
  valueLabel.label.dx = 10;
  valueLabel.label.hideOversized = false;
  valueLabel.label.truncate = false;

  var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
  categoryLabel.label.text = "{name}";
  categoryLabel.label.horizontalCenter = "right";
  categoryLabel.label.dx = -10;
  categoryLabel.label.fill = am4core.color("#fff");
  categoryLabel.label.hideOversized = false;
  categoryLabel.label.truncate = false;
}

/*
  Plot by clicking on table
*/
var table = document.getElementById("myTable");
if (table != null) {
  for (var i = 1; i < table.rows.length; i++) {
    for (var j = 0; j < table.rows[i].cells.length; j++)
      table.rows[i].cells[j].onclick = function() {
        data.push({
          "location": this.innerHTML,
          "mobility_before_distancing": 50,
          "mobility_after_distancing": 50
        });
        chart.data = reloadData();
      };
  }
}

function reloadData() {
  return data;
}

createSeries("mobility_before_distancing", "Pre-3/16");
createSeries("mobility_after_distancing", "Post-3/16");
