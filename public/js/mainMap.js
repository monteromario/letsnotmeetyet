let map;

console.log(userLocatios)

function initMap() {
  let mapMarker = null;
  const defaultPosition = { lat: 40.4167278, lng: -3.7033387 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
  });
}