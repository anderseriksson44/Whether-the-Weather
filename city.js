$(document).ready(function() {
    
    lat = 56.161224;
    long = 15.5869;
    truncLat=0;
    truncLong=0;
    initMap(lat, long);
//    $("div #info").html("<h1>Ingen plats angiven</h1>");
//    $("div #vader").html("<h1>Ingen plats angiven</h1>");
//    $("div #prognos").html("<h1>Ingen plats angiven</h1>");
//    $("div #sunset").html("<h1>Ingen plats angiven</h1>");
    realTime = new Date($.now());
    
    var tiden = realTime.getHours() + ":" + realTime.getMinutes() + ":" + realTime.getSeconds();
    console.log (tiden);


//Finding geo position based on city    
$("#stad").on('change', function() {
	   var city = $("#stad").val();
        console.log(city);
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyDuzxu8__OWFRao6WPZ7B1siwdigs1sCks", function(pos) {
            lat = pos.results[0].geometry.location.lat;
            long = pos.results[0].geometry.location.lng;
            initMap(lat, long);
//          Truncated latitud and longitud, for SMHI API to work.
            truncLat=truncate(lat, 6);
            truncLong=truncate(long,6);
            console.log(truncLat, truncLong);
            cityName = capitalize(city);
            
            $("div #info").html("<p>"+cityName+"</p>" + 
                               "<p>Latitud: "+lat+"</p>" + 
                               "<p>Longitud: "+long+"</p>");
                    
         
        getWeather(truncLat, truncLong);
        solen(truncLat, truncLong);
            
        });
    return truncLat, truncLong; 
    
    });

//$("#solned").on("click", function() {
function solen(lat, long) {
    $.get("http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+long+"&date=today&formatted=0", function(sun) {
        var upp= new Date(sun.results.sunrise);
        var ned= new Date(sun.results.sunset);
        console.log(ned);
        
        soluppTid = upp.getHours()+ ":" + upp.getMinutes();
        solnedTid = ned.getHours()+ ":" + ned.getMinutes();
        
        $("div #sunset").html("");
        
        $("div #sunset").html("<h2>I "+cityName+" går solen upp klockan " + soluppTid + " och ner kl "+ solnedTid+"</h2>");
        
        console.log("solen: "+ soluppTid+ " " + solnedTid);
        
//        $("#info").css("display", "none");
//        $("#vader").css("display", "none");
//        $("div #sunset").css("display", "block");
    });
};
    

//Create map
$("#karta").on("click", function() {
    initMap(truncLat, truncLong);
});
               

//Fetch wheather data    
//$("#stad").on("change", function() {

$("li #vader").on ("click", function(){
    getWeather(truncLat, truncLong);
})

$("li #sunset").on ("click", function(){
    solen(truncLat, truncLong);
})


function getWeather(truncLat, truncLong) {    
    var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/"+truncLong+"/lat/"+truncLat+"/data.json";
    $.get(url, function(vaderData) {
        
        var timestamps=vaderData.timeSeries.length; 
        var allavaderposter = vaderData.timeSeries[0].parameters.length;
        console.log(allavaderposter);
        console.log(timestamps);
       
        var realTime = new Date($.now());
        var realTimeHour = realTime.getHours();
        
        console.log(realTimeHour);
        var timestampHour;
        for (var y=0; realTimeHour!=timestampHour; y++) {
            var timestamp = new Date(vaderData.timeSeries[y].validTime);
            timestampHour = timestamp.getHours();
            
        }
        var mattid = vaderData.timeSeries[y];
        console.log("Timestamp hour är: "+timestampHour);
        
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
            if (Name=="Wsymb") {
                vaeder=Name;
                vaederValue=mattid.parameters[i].values[0];
            }
        }
  
//        $("div #info").css("display", "none");
//        $("div #sunset").css("display", "none");
//        $("div #vader").css("display", "block");
        
        $("div #vader").html("<h2>Temperatur: "+tempValue+" C </h2>" +
                        "<h2>Vind: "+windValue+" m/s </h2>" +
                        "<h2 class=ned>Nederbörd: "+nederbordValue+" mm </h2>");
        
        if (vaederValue == 1 || vaederValue == 2 ) {
            console.log(vaederValue);
            $("div #vader .ned").after("<h2>Klart: "+vaederValue+"</h2>" + "<img src=img/clearsky.png>");
                }
        else if (vaederValue == 3 || vaederValue == 4 ) {
            $("div #vader").after("<h2>Klart till halvklart: "+vaederValue+"</h2>"+ "<img src=img/light-clouds.png>");
            }
        else if (vaederValue == 5 || vaederValue == 6 ) {
            $("div #vader").after("<h2>Molnigt: "+vaederValue+"</h2>" + "<img src=img/cloudy.png>");
            }
        else if (vaederValue == 7) {
            $("div #vader").after("<h2>Dimmigt: "+vaederValue+"</h2>");
            }
        else if (vaederValue == 8) {
            $("div #vader").after("<h2>Regnskurar: "+vaederValue+"</h2>");
            }
        else if (vaederValue == 9) {
            $("div #vader").after("<h2>Åskskurar: "+vaederValue+"</h2>");
            }
        else if (vaederValue == 10) {
            $("div #vader").after("<h2>Snöblandat regn: "+vaederValue+"</h2>"+ "<img class=img-responsive src=img/snow-rain.png>");
            }
        else if (vaederValue == 11) {
            $("div #vader").after("<h2>Snöbyar: "+vaederValue+"</h2>");
            }
        else if (vaederValue == 12) {
            $("div #vader").after("<h2>Regn: "+vaederValue+"</h2>"+ "<img src=img/rain.png>");
            }
        else if (vaederValue == 13) {
            $("div #vader").after("<h2>Åska: "+vaederValue+"</h2>");
            }
        else if (vaederValue == 10 || vaederValue == 14) {
            $("div #vader").after("<h2>Snöblandat regn: "+vaederValue+"</h2>"+ "<img src=img/snow-rain.png>");
            }
        else if (vaederValue == 15) {
            $("div #vader").after("<h2>Snöfall: "+vaederValue+"</h2>"+ "<img src=img/snow.png>");
            }
      
            
        
        
//        console.log(time);
//        console.log(temp,tempValue);
//        console.log(wind,windValue);
//        console.log(nederbord,nederbordValue);

  });
};

    
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


