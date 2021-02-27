// function initMap() {
//     const defaultPosition = { lat: 40.4167278, lng: -3.7033387 }
//     const map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 14,
//       center: marker || defaultPosition,
//     });

//     let mapMarker = null

//     if (marker) {
//       mapMarker = new google.maps.Marker({
//         position: marker,
//         map: map,
//       });
//     }

//     if (editable) {
//       map.addListener('click', (e) => {
//         if (mapMarker) {
//           mapMarker.setMap(null)
//         }

//         mapMarker = new google.maps.Marker({
//           position: e.latLng,
//           map: map
//         })

//         const coordinates = e.latLng.toJSON()

//         document.getElementById('lat').value = coordinates.lat
//         document.getElementById('lng').value = coordinates.lng

//         map.panTo(e.latLng)
//       })
//     }
//   }

let map;

function initMap() {
  let mapMarker = null;
  const defaultPosition = { lat: 40.4167278, lng: -3.7033387 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
  });

  //   let initMarker = new google.maps.Marker({
  //     position: mapMarker || defaultPosition,
  //     map: map,
  //   });

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
}
