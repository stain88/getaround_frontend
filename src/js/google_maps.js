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
    zoom: 17
  });
  
  var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, map);

centerControlDiv.index = 1;
map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
  
  
  var image = 'img/current_location_icon.png';
  var current_location_marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: image
  });
  

  infowindow = new google.maps.InfoWindow();
var bars = new google.maps.places.PlacesService(map);
  bars.nearbySearch({
    location: pos,
    types: ['bar'],
    rankBy: google.maps.places.RankBy.DISTANCE
  }, callback);
  
  
 var restaurants = new google.maps.places.PlacesService(map);
  restaurants.nearbySearch({
    location: pos,
    types: ['restaurant'],
    rankBy: google.maps.places.RankBy.DISTANCE
  }, callback);
  
 
  
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      console.log(results[i]);
    }
  }
}

function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('a');
        controlUI.style.display = 'inline-block';
        controlUI.style.backgroundColor = '#37c1f0';
        controlUI.style.border = '2px solid #4c4c4d';
        controlUI.style.borderRadius = '15px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '50px';
        controlUI.style.textAlign = 'center';
        controlUI.style.textDecoration = 'none';
        controlUI.href="/event";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('span');
        controlText.style.color = '#ffffff';
        controlText.style.fontFamily = 'Helvetica,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '40px';
        controlText.style.paddingLeft = '20px';
        controlText.style.paddingRight = '20px';
        controlText.innerHTML = 'Check In';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {


        });

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