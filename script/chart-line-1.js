am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// Create chart instance
var chart_1 = am4core.create("chartdiv_1", am4charts.XYChart);

// Set up data source
// chart.dataSource.url = "https://raw.githubusercontent.com/mdredze/covid19_social_mobility.github.io/master/data/longitudinal_compiled.csv";
chart_1.dataSource.url = "https://raw.githubusercontent.com/CharlotteZKHu/hiv_web.github.io/main/data/hiv_test_longitudinal.csv";
chart_1.dataSource.parser = new am4core.CSVParser();
chart_1.dataSource.parser.options.useColumnNames = true;

// Create axes
var categoryAxis_1 = chart_1.xAxes.push(new am4charts.CategoryAxis());
categoryAxis_1.dataFields.category = "Dates";

// Create value axis
var valueAxis_1 = chart_1.yAxes.push(new am4charts.ValueAxis());
valueAxis_1.title.text = "Number of tweets";

// Create Series
function createSeries_self(field, name, bullet, cover) {

  var series_1 = chart_1.series.push(new am4charts.LineSeries());
  series_1.dataFields.valueY = field;
  series_1.dataFields.categoryX = "Dates";
  series_1.strokeWidth = 2;
  series_1.name = name;
  series_1.tooltipText = "{name}: [bold]{valueY}[/]";
  series_1.tensionX = 0.7;
  series_1.showOnInit = true;
  series_1.hidden = cover;

  var interfaceColors = new am4core.InterfaceColorSet();

  switch(bullet) {
    case "triangle":
      var bullet = series_1.bullets.push(new am4charts.Bullet());
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
      var bullet = series_1.bullets.push(new am4charts.Bullet());
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
      var bullet = series_1.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = interfaceColors.getFor("background");
      bullet.circle.strokeWidth = 2;
      break;
  }
}

// Add legend
chart_1.legend = new am4charts.Legend();
chart_1.legend.position = "bottom";

// Add cursor
chart_1.cursor = new am4charts.XYCursor();

// Add scroll bar - keep at bottom of graph
chart_1.scrollbarX = new am4core.Scrollbar();
chart_1.scrollbarX.parent = chart_1.bottomAxesContainer;
chart_1.events.on("ready", function () {
  categoryAxis_1.start = 0.7;
  categoryAxis_1.end = 1;
  categoryAxis_1.keepSelection = true;
});

/*
  Geolocation with HTML5
*/
var x = document.getElementById("demo_1");

function getLocation_self() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition_self);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/*
  Plotting on map disabled
  Reverse geocoding based on longitude & latitude
*/
function showPosition_self(position) {
  // initialize Google Maps
  var map = new google.maps.Map(document.getElementById('map_1'), {
    zoom: 8,
    center: {lat: position.coords.latitude, lng: position.coords.longitude}
  });

  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  // input right latitude & longitude to search box
  var latlng = document.getElementById("latlng_1");
  latlng.value = position.coords.latitude + "," + position.coords.longitude;

  var input = document.getElementById('latlng_1').value;
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var txtOutput = document.getElementById("txtOutput_1");
        txtOutput.value = results[0].formatted_address;

      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

    var str = results[0].formatted_address;
    var res = str.split(", ");
    var stateOutput = document.getElementById("stateOutput_1");
    stateOutput.value = res[2].substring(0, 2);
    createSeries_self(res[2].substring(0, 2), res[2].substring(0, 2), "circle", false);
  });
}

/*
  Search City, State, Region
*/
function searchFunction_self() {
  var input_1, filter_1, table_1, tr_1, td_1, i_1, txtValue_1;
  input_1 = document.getElementById("myInput_1");
  filter_1 = input_1.value.toUpperCase();
  table_1 = document.getElementById("myTable_2");
  tr_1 = table_1.getElementsByTagName("tr");
  for (i_1 = 0; i_1 < tr_1.length; i_1++) {
    td_1 = tr_1[i_1].getElementsByTagName("td")[0];
    td2 = tr_1[i_1].getElementsByTagName("td")[1];
    // td3 = tr[i].getElementsByTagName("td")[2];
    if (td_1) {
      txtValue_1 = td_1.textContent || td_1.innerText;
      if (txtValue_1.toUpperCase().indexOf(filter_1) > -1) {
        tr_1[i_1].style.display = "";
      } else {
        tr_1[i_1].style.display = "none";
      }
    }
    if (td2) {
      txtValue_1 = td2.textContent || td2.innerText;
      if (txtValue_1.toUpperCase().indexOf(filter_1) > -1) {
        tr_1[i_1].style.display = "";
      }
    }
    if (td3) {
      txtValue_1 = td3.textContent || td3.innerText;
      if (txtValue_1.toUpperCase().indexOf(filter_1) > -1) {
        tr_1[i_1].style.display = "";
      }
    }
  }
}

/*
  Sort table A-Z or Z-A
*/
function sortTable_self(n) {
  var table_1, rows_1, switching_1, i_1, x_1, y_1, shouldSwitch_1, dir_1, switchcount_1 = 0;
  table_1 = document.getElementById("myTable_2");
  switching_1 = true;
  dir_1 = "asc";

  while (switching_1) {
    switching_1 = false;
    rows_1 = table_1.rows;

    for (i_1 = 1; i_1 < (rows_1.length - 1); i_1++) {
      shouldSwitch_1 = false;
      x_1 = rows_1[i_1].getElementsByTagName("TD")[n];
      y_1 = rows_1[i_1 + 1].getElementsByTagName("TD")[n];
      if (dir_1 == "asc") {
        if (x_1.innerHTML.toLowerCase() > y_1.innerHTML.toLowerCase()) {
          shouldSwitch_1= true;
          break;
        }
      } else if (dir_1 == "desc") {
        if (x_1.innerHTML.toLowerCase() < y_1.innerHTML.toLowerCase()) {
          shouldSwitch_1 = true;
          break;
        }
      }
    }
    if (shouldSwitch_1) {
      rows_1[i_1].parentNode.insertBefore(rows_1[i_1 + 1], rows_1[i_1]);
      switching_1 = true;
      switchcount_1 ++;
    } else {
      if (switchcount_1 == 0 && dir_1 == "asc") {
        dir_1 = "desc";
        switching_1 = true;
      }
    }
  }
}

/*
  Plot by clicking on table
*/
var table_2 = document.getElementById("myTable_2");
if (table_2 != null) {
    for (var i = 1; i < table_2.rows.length; i++) {
        for (var j = 0; j < table_2.rows[i].cells.length; j++)
        table_2.rows[i].cells[j].onclick = function () {
            tableText_self(this);
            this.onclick=null;
        };
    }
}

// function tableText_self(tableCell) {
//   var location = tableCell.innerHTML;
//   var regions = ["Northeast", "Midwest", "Central", "South", "West", "Caribbean"];
//   // check for state (circle)
//   if (location.substring(0, 2) === location.substring(0, 2).toUpperCase()) {
//     createSeries_self(location.substring(0, 2), location, "circle", false);
//   }
//   // check for region (triangle)
//   else if (regions.indexOf(location) > -1) {
//     createSeries_self(location, location, "triangle", false);
//   }
//   // otherwise a city (rectangle)
//   else {
//     createSeries_self(location, location, "rectangle", false);
//   }
// }

/*
  Search Key_words
*/
function searchFunction_ky_self() {
  var input_1, filter_1, table_1, tr_1, td_1, i_1, txtValue_1;
  input_1 = document.getElementById("myInput_1");
  filter_1 = input_1.value.toUpperCase();
  table_1 = document.getElementById("myTable_3");
  tr_1 = table_1.getElementsByTagName("tr");
  for (i_1 = 0; i_1 < tr_1.length; i_1++) {
    td_1 = tr_1[i_1].getElementsByTagName("td")[0];
    // td2 = tr[i].getElementsByTagName("td")[1];
    // td3 = tr[i].getElementsByTagName("td")[2];
    if (td_1) {
      txtValue_1 = td_1.textContent || td_1.innerText;
      if (txtValue_1.toUpperCase().indexOf(filter_1) > -1) {
        tr_1[i_1].style.display = "";
      } else {
        tr_1[i_1].style.display = "none";
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
var table_1 = document.getElementById("myTable_3");
if (table_1 != null) {
    for (var i = 1; i < table_1.rows.length; i++) {
        for (var j = 0; j < table_1.rows[i].cells.length; j++)
        table_1.rows[i].cells[j].onclick = function () {
            tableText_self(this);
            this.onclick=null;
        };
    }
}

function tableText_self(tableCell) {
  var location = tableCell.innerHTML;
  var prep_key_words = ["test", "tests", "tested", "testing", "oraquick"];
  // check for state (circle)
  if (location.substring(0, 2) === location.substring(0, 2).toUpperCase()) {
    createSeries_self(location.substring(0, 2), location, "circle", false);
  }
  // check for region (triangle)
  else if (prep_key_words.indexOf(location) > -1) {
    createSeries_self(location, location, "triangle", false);
  }
  // otherwise a city (rectangle)
  else {
    createSeries_self(location, location, "rectangle", false);
  }
}


// plot US avg by default
createSeries_self("United States", "USA", "triangle", false);
