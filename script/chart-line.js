am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Set up data source
// chart.dataSource.url = "https://raw.githubusercontent.com/mdredze/covid19_social_mobility.github.io/master/data/longitudinal_compiled.csv";
chart.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_twitter.github.io/main/data/hiv_prep_longitudinal.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;

// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "Dates";

// Create value axis
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.title.text = "Number of tweets";

// Create Series
function createSeries(field, name, bullet, cover) {

  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.categoryX = "Dates";
  series.strokeWidth = 2;
  series.name = name;
  series.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tensionX = 0.7;
  series.showOnInit = true;
  series.hidden = cover;

  var interfaceColors = new am4core.InterfaceColorSet();

  switch(bullet) {
    case "triangle":
      var bullet = series.bullets.push(new am4charts.Bullet());
      bullet.width = 12;
      bullet.height = 12;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";

      var triangle = bullet.createChild(am4core.Triangle);
      triangle.stroke = interfaceColors.getFor("background");
      triangle.strokeWidth = 2;
      triangle.direction = "top";
      triangle.width = 12;
      triangle.height = 12;
      break;
    case "rectangle":
      var bullet = series.bullets.push(new am4charts.Bullet());
      bullet.width = 10;
      bullet.height = 10;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";

      var rectangle = bullet.createChild(am4core.Rectangle);
      rectangle.stroke = interfaceColors.getFor("background");
      rectangle.strokeWidth = 2;
      rectangle.width = 10;
      rectangle.height = 10;
      break;
    default:
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = interfaceColors.getFor("background");
      bullet.circle.strokeWidth = 2;
      break;
  }
}

// Add legend
chart.legend = new am4charts.Legend();
chart.legend.position = "bottom";

// Add cursor
chart.cursor = new am4charts.XYCursor();

// Add scroll bar - keep at bottom of graph
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.parent = chart.bottomAxesContainer;
chart.events.on("ready", function () {
  categoryAxis.start = 0.7;
  categoryAxis.end = 1;
  categoryAxis.keepSelection = true;
});

/*
  Geolocation with HTML5
*/
var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/*
  Plotting on map disabled
  Reverse geocoding based on longitude & latitude
*/
function showPosition(position) {
  // initialize Google Maps
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: position.coords.latitude, lng: position.coords.longitude}
  });

  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  // input right latitude & longitude to search box
  var latlng = document.getElementById("latlng");
  latlng.value = position.coords.latitude + "," + position.coords.longitude;

  var input = document.getElementById('latlng').value;
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var txtOutput = document.getElementById("txtOutput");
        txtOutput.value = results[0].formatted_address;

      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

    var str = results[0].formatted_address;
    var res = str.split(", ");
    var stateOutput = document.getElementById("stateOutput");
    stateOutput.value = res[2].substring(0, 2);
    createSeries(res[2].substring(0, 2), res[2].substring(0, 2), "circle", false);
  });
}

/*
  Search City, State, Region
*/
function searchFunction_kw() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    td2 = tr[i].getElementsByTagName("td")[1];
    // td3 = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
    if (td2) {
      txtValue = td2.textContent || td2.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      }
    }
    if (td3) {
      txtValue = td3.textContent || td3.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      }
    }
  }
}

/*
  Sort table A-Z or Z-A
*/
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

/*
  Plot by clicking on table
*/
var table = document.getElementById("myTable");
if (table != null) {
    for (var i = 1; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++)
        table.rows[i].cells[j].onclick = function () {
            tableText(this);
            this.onclick=null;
        };
    }
}

// function tableText(tableCell) {
//   var location = tableCell.innerHTML;
//   var regions = ["Northeast", "Midwest", "Central", "South", "West", "Caribbean"];
//   // check for state (circle)
//   if (location.substring(0, 2) === location.substring(0, 2).toUpperCase()) {
//     createSeries(location.substring(0, 2), location, "circle", false);
//   }
//   // check for region (triangle)
//   else if (regions.indexOf(location) > -1) {
//     createSeries(location, location, "triangle", false);
//   }
//   // otherwise a city (rectangle)
//   else {
//     createSeries(location, location, "rectangle", false);
//   }
// }

/*
  Search Key_words
*/
function searchFunction_kw() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable_1");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    // td2 = tr[i].getElementsByTagName("td")[1];
    // td3 = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
    // if (td2) {
    //   txtValue = td2.textContent || td2.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     tr[i].style.display = "";
    //   }
    // }
    // if (td3) {
    //   txtValue = td3.textContent || td3.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     tr[i].style.display = "";
    //   }
    // }
  }
}


/*
  Plot by clicking on table
*/
var table_1 = document.getElementById("myTable_1");
if (table_1 != null) {
    for (var i = 1; i < table_1.rows.length; i++) {
        for (var j = 0; j < table_1.rows[i].cells.length; j++)
        table_1.rows[i].cells[j].onclick = function () {
            tableText(this);
            this.onclick=null;
        };
    }
}

function tableText(tableCell) {
  var location = tableCell.innerHTML;
  var prep_key_words = ["prep", "prophylaxis", "truvada", "descovy", "apretude"];
  // check for state (circle)
  if (location.substring(0, 2) === location.substring(0, 2).toUpperCase()) {
    createSeries(location.substring(0, 2), location, "circle", false);
  }
  // check for region (triangle)
  else if (prep_key_words.indexOf(location) > -1) {
    createSeries(location, location, "triangle", false);
  }
  // otherwise a city (rectangle)
  else {
    createSeries(location, location, "rectangle", false);
  }
}


// plot US avg by default
createSeries("United States", "USA", "triangle", false);
