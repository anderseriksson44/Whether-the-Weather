# Webappliactionsutveckling - Final assignment

##  - Whether the Weather - 

### Author: Anders Eriksson

### School: Lernia Stockholm, Sweden.

### Program: JavaScript developer - Front End, YHJUST16.
#### Course: Webappliactionsutveckling.

### Project: A school project to show our skills in Webcommunication using AJAX.

#### About the project:

This applicaiton is a weather application that present current weather, sun information and and map of a searched location.
The intention with this project was to use open APIs to fetch location-, weather- and sun-data.

#### Technologies used 

* HTML for structure.
* CSS/Bootstrap for design.
* JavaScript/jQuery for functionality and logic.
* AJAX to fetch data (JSON) from the APIs
* Git for version control.

#### Description of the application 

The application presents current weather conditions for a location. You can search for the location in a search field in the top of the screen.
When a certain place is entered, an API request is sent to fetch the exact geo location (longitud and latitud). This data is then used in the next API requests which fetches the weather information from SMHI and the another API request that fetch the sunrise and sunset information. 

Also, the searched place is also printed on a map, through another API request.


#### APIs used

I have worked with basically these 3 differnt APIs

* Google Maps (https://maps.googleapis.com)
To find the location information (latitud and longitud) of a certain place.
And also to print the map of the searched place.

* sunrise-sunset.org (http://api.sunrise-sunset.org)
To find when the sun goes up and down for the searched place.

* SMHI (http://opendata-download-metfcst.smhi.se)
To get the weather from the searched place.

#### Working process

It took some time until decided on this weather applications. Started off with other type of APIs but discarded several ideas since either the API was not working properly or was lacking certain things, or the fact that I did not manage to figure them out.

Learings from this project is that start small and grow it as you go. Not the other way around which I did. I had big ambtions and started coding accordingly, without having total control of the API (mainly the SMHI API). So I have had to scale down on functionality during the way.

Most focus was put on AJAX and JSON on this project, hence the graphics and layout had to stand down in priority and therefor I started designing with desktop in mind and in the last phase made sure it worked on a iPad as well.


#### Website live at: http://www.amefoto.se/wheathertheweather/

### Contact info: a.eriksson44@gmail.com

### [Linkedin](https://se.linkedin.com/in/anders-eriksson-76151a8a "Linkedin")

Enjoy my project!