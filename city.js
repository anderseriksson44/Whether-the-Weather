$(document).ready(function() {
    
    lat = 56.161224;
    long = 15.5869;
    truncLat=0;
    truncLong=0;
    initMap(lat, long);     

//Finding geo position based on city    
$("#stad").on('change', function() {
	   var city = $("#stad").val();
        console.log(city);
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyDuzxu8__OWFRao6WPZ7B1siwdigs1sCks", function(pos) {
            lat = pos.results[0].geometry.location.lat;
            long = pos.results[0].geometry.location.lng;
            
//          Truncated latitud and longitud, for SMHI API to work.
            truncLat=truncate(lat, 6);
            truncLong=truncate(long,6);
            console.log(truncLat, truncLong);
            cityName = capitalize(city);
        
            $("#results").html("<p>"+cityName+"</p>" + 
                               "<p>Latitud: "+lat+"</p>" + 
                               "<p>Longitud: "+long+"</p>");
                    
           
        });
    return truncLat, truncLong ; 
    });

$("#solned").on("click", function() {
    $.get("http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+long+"&date=today", function(sun) {
                $("#sunset").html("<h2>I "+cityName+" går solen upp klockan " + sun.results.sunrise + " och ner kl "+ sun.results.sunset+"</h2>");
            });
});
    

//Create map
$("#karta").on("click", function() {
    initMap(truncLat, truncLong);
});
               

//Fetch wheather data    
$("#wheather").on("click", function() {
    console.log(truncLat);
    var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/"+truncLong+"/lat/"+truncLat+"/data.json";
    $.get(url, function(vaderData) {
        var time = vaderData.timeSeries[0].validTime;
        var mattid =vaderData.timeSeries[0];
        var timestamps=vaderData.timeSeries.length; 
        var allavaderposter = vaderData.timeSeries[0].parameters.length;
        console.log(allavaderposter);
        console.log(timestamps);
       
        for (var i=0; i<allavaderposter; i++) {
        var Name= mattid.parameters[i].name;
        
            if (Name == "t") {
                temp=Name;
                tempValue=mattid.parameters[i].values[0];
            }
            if (Name=="ws") {
                wind=Name;
                windValue=mattid.parameters[i].values[0];
            }
            if (Name=="pcat") {
                nederbord=Name;
                nederbordValue=mattid.parameters[i].values[0];
            }
        }
  
        console.log(time);
        console.log(temp,tempValue);
        console.log(wind,windValue);
        console.log(nederbord,nederbordValue);

  });
});

    
function truncate (num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

//Capitalize first letter in cityname
function capitalize(cityname) {
    return cityname.charAt(0).toUpperCase() + cityname.slice(1);
}

//Create map
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


