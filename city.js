$(document).ready(function() {
    
    lat = 56.161224;
    long = 15.5869;
    truncLat=56.161224;
    truncLong=15.5869;
    initMap(lat, long);
    realTime = new Date($.now());
    cityName="Karlskrona";
    anim=true;
    y=0;
    timestampHour=0;
    getWeather(truncLat, truncLong);
    
 $("#ss").on("click", function(){
    $("#vader").css("hide");
    $("#vader").removeClass("show");
    $("#sunset").removeAttr("style");
//    console.log("ss klickad");
    solen(truncLat, truncLong, cityName);
 
});

$("#vv").on("click", function(){
    $("#vader").css("show");
//    console.log("vv klickad");
});

    
    

    var tiden = realTime.getHours() + ":" + realTime.getMinutes() + ":" + realTime.getSeconds();
    switch (realTime.getDay()) {
    case 0:
        day = "Söndag";
        break;
    case 1:
        day = "Måndag";
        break;
    case 2:
        day = "Tisdag";
        break;
    case 3:
        day = "Onsdag";
        break;
    case 4:
        day = "Torsdag";
        break;
    case 5:
        day = "Fredag";
        break;
    case 6:
        day = "Lördag";
}
    

//Finding geo position based on city    
$("#stad").on("change", function() {
	   var city = $("#stad").val();
        cityName = capitalize(city);
        console.log("stad "+cityName);
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyDuzxu8__OWFRao6WPZ7B1siwdigs1sCks", function(pos) {
            lat = pos.results[0].geometry.location.lat;
            long = pos.results[0].geometry.location.lng;
            initMap(lat, long);
//          Truncated latitud and longitud, for SMHI API to work.
            truncLat=truncate(lat, 6);
            truncLong=truncate(long,6);
        });
    
    
    getWeather(truncLat, truncLong);

//Återställ moln och sol till ursprungsläge efter animering
    anim=true;
    $(".moln").css({
        left: "-10%",
        bottom: "-90px"
    });
    $(".solupp").css({
        bottom: "-90px",
        left: "10%"
    });
        solen(truncLat, truncLong, cityName);
    
});

function solen(lat, long, stad) {
    
    $.get("http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+long+"&date=today&formatted=0", function(sun) {
        var upp= new Date(sun.results.sunrise);
        var ned= new Date(sun.results.sunset);
        console.log(ned);
        
        var upMin = upp.getMinutes();
        var nedMin = ned.getMinutes();
        if (upMin <10) {
            upMin = "0"+upMin;
        }
        if (nedMin <10) {
            nedMin = "0"+nedMin;
        }
                
        soluppTid = upp.getHours()+ ":" + upMin;
        solnedTid = ned.getHours()+ ":" + nedMin;
        
        
        console.log("Solen" +cityName);
        
        
        $("#place").html("<h2>I "+cityName+" går solen upp klockan " + soluppTid + " och ner kl "+ solnedTid+"</h2>"); 
        
        $("#s_upp").text(soluppTid);
               
        
//Solfilmen
        if((anim) && ($("#sunset").hasClass("active"))) {
            $("#sun").delay(1000).animate({bottom: '+=200'},2000);
            $("#sun").animate({left: '+=350'},2000); 
            $("#sun").animate({bottom: '+=-200'},3000);
            $("#cloud").animate({left: '+=340'},8000); 
            anim=false;
        }
        else{
            
        }
    });
};



function getWeather(truncLat, truncLong) {    
    var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/"+truncLong+"/lat/"+truncLat+"/data.json";
    $.get(url, function(vaderData) {
        
        var timestamps=vaderData.timeSeries.length; 
        var allavaderposter = vaderData.timeSeries[0].parameters.length;
       
        var realTime = new Date($.now());
        var realTimeHour = realTime.getHours();
        
        var timestampHour;
        for (var y=0; realTimeHour!=timestampHour; y++) {
            var timestamp = new Date(vaderData.timeSeries[y].validTime);
            timestampHour = timestamp.getHours();
            
        }
        var mattid = vaderData.timeSeries[y];

//Hitta de väderparametrar jag använder    
        
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
  
//Säkerställa så att inte vädret skrivs över av sol-informationen och vice versa
        if ($("#vader").hasClass("show")) {
            $("#sunset").css("hide");
            $("#vader").addClass("in active show");
            $("#vader").css("show");
            console.log("w-active");
        }
        else if ($("#sunset").hasClass("show")) {
            $("#vader").css("hide");
            $("#vader").removeClass("in active show");
        }
        
       
        //Skriva ut värdet på alla parametrar
        
        $("#t").html(tempValue + "  C"); 
        $("#ws").html(windValue + "  m/s"); 
        $("#pcat").html(nederbordValue + "  mm"); 

        

        
        if (vaederValue == 1 || vaederValue == 2 ) {
            $("#wsymb").html("Klart väder");
            $("#vadersymbol").html("<img class=symbol center-block src=img/clearsky.png>");
            $("#heading").html("<h3>"+cityName+" har just nu kanonväder.</h3>");
            }
        else if (vaederValue == 3 || vaederValue == 4 ) {
            $("#wsymb").html("Klart till halvklart");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/light-clouds.png>");
            $("#heading").html("<h2>"+cityName+" har just nu hyffsat fint väder.</h2>");
            }
        else if (vaederValue == 5 || vaederValue == 6 ) {
            $("#wsymb").html("Molnigt");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/cloudy.png>");
            $("#heading").html("<h2>"+cityName+" har just nu molnigt. </h2>");
            }
        else if (vaederValue == 7) {
            $("#wsymb").html("Dimmigt");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/fog.png>");
            $("#heading").html("<h3>"+cityName+" har just nu dimma. </h3>");
            }
        else if (vaederValue == 8) {
            $("#wsymb").html("Regnskurar");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/rain.png>");
            $("#heading").html("<h3>"+cityName+" har just nu regnskurar. </h3>");
            }
        else if (vaederValue == 9) {
            $("#wsymb").html("Åskskurar");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/thunderstorms.png>");
            $("#heading").html("<h3>"+cityName+" har just nu åskskurar. </h3>");
            }
        else if (vaederValue == 10 || vaederValue == 14) {
            $("#wsymb").html("Snöblandat regn");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/snow-rain.png>");
            $("#heading").html("<h3>"+cityName+" har just nu snöblandat regn. </h3>");
            }
        else if (vaederValue == 11) {
            $("#wsymb").html("Snöbyar");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/snobyar.png>");
            $("#heading").html("<h3>"+cityName+" har just nu snöbyar. </h3>");
            }
        else if (vaederValue == 12) {
            $("#wsymb").html("Regn");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/rain.png>");
            $("#heading").html("<h3>"+cityName+" har just nu regn. </h3>");
            }
        else if (vaederValue == 13) {
            $("#wsymb").html("Åska");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/thunderstorms.png>");
            $("#heading").html("<h3>"+cityName+" har just nu åska. </h3>");
            }
        else if (vaederValue == 15) {
            $("#wsymb").html("Snöfall");
            $("#vadersymbol").html("<img class='symbol center-block' src=img/snow.png>");
            $("#heading").html("<h3>"+cityName+" har just nu snöfall.</h3>");
            }

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




