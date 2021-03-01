let map;

function initMap() {
  let mapMarker = null;
  const defaultPosition = { lat: 40.4167278, lng: -3.7033387 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
  });

  const markers = userLocations.map((user) => {
    let icon = {
      url: user.userPicture, // url
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };

    let shape = {
      coords: [25, 25, 25],
      type: 'circle'
    };

    const contentString = '<div id="content">' +
      '<h5 id="firstHeading" class="firstHeading">' + user.username + '</h5>' +
      '<div id="picture">' +
      '<img src="' + user.userPicture + '" alt="' + user.username + 'width="100" height="100">' +
      '</div>' +
      '<br/>' +
      '<form action = "/user/' + user.username + '">' +
      '<input type="submit" value="PROFILE" />' +
      "</form >" +
      "</div>"

    //"<input type='button' onClick=getDir() value='Go!'>" + TODO get route to marker
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    const marker = new google.maps.Marker({
      position: { lat: user.coordinates[1], lng: user.coordinates[0] },
      //label: user.username,
      icon: icon,
      shape: shape,
      map: map
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  });

  new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });

}