let map, infoWindow;

function initMap() {
  let mapMarker = null;
  const defaultPosition = { lat: 40.4167278, lng: -3.7033387 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
  });

  mapMarker = new google.maps.Marker({
    position: mapMarker || defaultPosition,
    map: map,
  });

  map.addListener("click", (e) => {
    if (mapMarker) {
      mapMarker.setMap(null);
    }

    mapMarker = new google.maps.Marker({
      position: e.latLng,
      label: 'YOU',
      map: map,
    });

    const coordinates = e.latLng.toJSON();

    document.getElementById("lat").value = coordinates.lat;
    document.getElementById("lng").value = coordinates.lng;

    map.panTo(e.latLng);
  });

  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);

          document.getElementById("lat").value = pos.lat;
          document.getElementById("lng").value = pos.lng;
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: Enable location or click manually"
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
}
