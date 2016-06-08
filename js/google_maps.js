var map;
var infowindow;
var pos;


function get_location(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
    startMap();
    });
  } else {
    // Browser doesn't support Geolocation
	console.log("error: doesn't support geolocation");
}


}


function startMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    zoom: 15
  });
  
  
  var image = 'img/current_location_icon.png';
  var current_location_marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: image
  });
  

  infowindow = new google.maps.InfoWindow();
  
  
  
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pos,
    radius: 1000,
    type: "bar"
  }, callback);
  
  var service2 = new google.maps.places.PlacesService(map);
  service2.nearbySearch({
    location: pos,
    radius: 1000,
    type: "restaurant"
  }, callback);
  
  
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}



function createMarker(place) {

	var image = 'img/event_location.png';
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
	icon: image
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent("<div class=\"infowindow\">" + place.name + "<br /><a href=\"event.html\">Go to Event page</a> </div>");
    infowindow.open(map, this);
  });
}