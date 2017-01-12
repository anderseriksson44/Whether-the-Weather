$(document).ready(function() {

        
    
    $("#query").on("change", function() {
	   var city = $("#query").val();
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyDuzxu8__OWFRao6WPZ7B1siwdigs1sCks", function(pos) {
           var lat = pos.results[0].geometry.location.lat;
           var long = pos.results[0].geometry.location.lng;
           initMap(lat, long);
//            return lat, long;
            var cityName = capitalize(city);
            $("#results").html("<p>"+lat+"</p>" + 
                              "<p>"+long+"</p>" +
                              "<p>"+cityName+"</p>");
                    
            $.get("http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+long+"&date=today", function(sunset) {
                $("#sunset").html("<h2>Solen går ner kl " + sunset.results.sunset + " i " +cityName+ "</h2>");
            });

        });
        
    });
    
$("#wheather").on("click", function() {
  var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/15.5869/lat/56.161224/data.json";
  var res = $.getJSON(url, function(vaderData) {
    var time = vaderData.timeSeries[24].validTime;
//    var temp = vaderData.timeSeries[24].parameters.name;  
      console.log(time);
      console.log(temp);

  });
});


function capitalize(cityname) {
    return cityname.charAt(0).toUpperCase() + cityname.slice(1);
}

function initMap(latitud, longitud) {
            var uluru = {lat: latitud, lng: longitud};
            var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 8,
                    center: uluru
                });
            var marker = new google.maps.Marker({
            position: uluru,
            map: map
            });
}
});
    
    
//$("#wheather").on("click", function() {
//  var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/15.5869/lat/56.161224/data.json";
//  var res = $.getJSON(url, function(json) {
//    var items = [];
//    var stations = json.station;
//    for (var key in stations) {
//      if (stations.hasOwnProperty(key)) {
//        items.push( "<li>" + stations[key].name + "</li>" );
//      }
//    }
//    $( "<ul/>", {
//      "class": "station-list",
//      html: items.join( "" )
//    }).appendTo( "body" );
//  })
//  .done(function() {
//    console.log( "Get JSON done" );
//  })
//  .fail(function(jqxhr, textStatus, error) {
//    console.log( "Get JSON error" );
//  })
//  .always(function() {
//    console.log( "Get JSON complete" );
//  });
//});


