//render map no update location
// import { fetchDataFromFirebase } from "./firebaseProcessing.js";

// export async function initializeMap() {
//   const { humidity, temperature } = await fetchDataFromFirebase();
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoibWluaHBoYW1ia3U1MTUxIiwiYSI6ImNsbDlnYjF3YjFqbzAzZW8xcXBwdGpreWUifQ.1MJp33ncZBZleo5IIpEU4Q";
//   var map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/minhphambku5151/clw3av9mo01at01qugfl41sco",
//     center: [106,10],
//     zoom: 30,
//   });

//   var marker = new mapboxgl.Marker()
//     .setLngLat([106,10])
//     .addTo(map);
//   return map;
// }

//render map with update location right way

import { fetchDataFromFirebase } from "./firebaseProcessing.js";

export async function initializeMap() {
  // Fetch initial data from Firebase
  // const initialData = await fetchDataFromFirebase();
  // const humidity = parseFloat(initialData.humidity.toFixed(3));
  // const temperature = parseFloat(initialData.temperature.toFixed(3));
  let { longitude, latitude } = await fetchDataFromFirebase();
  longitude /= 1000000;
  latitude /= 1000000;
  // Initialize the map
  mapboxgl.accessToken = "pk.eyJ1IjoibWluaHBoYW1ia3U1MTUxIiwiYSI6ImNsbDlnYjF3YjFqbzAzZW8xcXBwdGpreWUifQ.1MJp33ncZBZleo5IIpEU4Q";
    
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/minhphambku5151/clw3av9mo01at01qugfl41sco",
    center: [longitude, latitude],
    zoom: 17,
  });

  var marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);

  // Update the map with new data every 2 seconds
  const updateData = setInterval(async () => {
    let { longitude, latitude } = await fetchDataFromFirebase();
    console.log(longitude, latitude);
    longitude /= 1000000;
    latitude /= 1000000;
    console.log(longitude, latitude);
    marker.setLngLat([longitude, latitude]);
    map.flyTo({
      center: [longitude, latitude],
      zoom: 17,
      speed: 1,
    });
  }, 1000);

  return map;
}

//slowly move marker
// import { fetchDataFromFirebase } from "./firebaseProcessing.js";

// export async function initializeMap() {
//   // Fetch initial data from Firebase
//   const { longitude, latitude } = await fetchDataFromFirebase();

//   // Initialize the map
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoibWluaHBoYW1ia3U1MTUxIiwiYSI6ImNsbDlnYjF3YjFqbzAzZW8xcXBwdGpreWUifQ.1MJp33ncZBZleo5IIpEU4Q";
//   var map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/minhphambku5151/clw3av9mo01at01qugfl41sco",
//     center: [longitude, latitude],
//     zoom: 17,
//   });

//   var marker = new mapboxgl.Marker()
//     .setLngLat([longitude, latitude])
//     .addTo(map);

//   var popup = new mapboxgl.Popup({
//     offset:30
//   })
//     .setLngLat([longitude, latitude])
//     .setHTML(`<p>Longitude: ${longitude}, Latitude: ${latitude} </p>`)
//     .addTo(map);

//   // Update the marker position with animation every 2 seconds
//   const updateData = setInterval(async () => {
//     const { longitude: newLongitude, latitude: newLatitude } =
//       await fetchDataFromFirebase();

//     // Interpolate marker movement over 1 second
//     const duration = 1000; // 1 second
//     const numSteps = 30; // 60 steps for 1 second animation
//     const lngStep = (newLongitude - marker.getLngLat().lng) / numSteps;
//     const latStep = (newLatitude - marker.getLngLat().lat) / numSteps;

//     // Perform animation
//     let step = 0;
//     const moveMarker = () => {
//       if (step < numSteps) {
//         const lng = marker.getLngLat().lng + lngStep;
//         const lat = marker.getLngLat().lat + latStep;
//         marker.setLngLat([lng, lat]);
//         step++;
//         setTimeout(moveMarker, duration / numSteps);
//       } else {
//         // When animation is complete, update marker's position to final destination
//         marker.setLngLat([newLongitude, newLatitude]);
//         map.flyTo({
//           center: [newLongitude, newLatitude],
//           zoom: 17,
//           speed: 0.5,
//         });
//       }
//     };

//     moveMarker();
//   }, 1000);
//   return map;
// }

//popup
// import { fetchDataFromFirebase } from "./firebaseProcessing.js";

// export async function initializeMap() {
//   // Fetch initial data from Firebase
//   const { humidity, temperature } = await fetchDataFromFirebase();

//   // Initialize the map
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoibWluaHBoYW1ia3U1MTUxIiwiYSI6ImNsbDlnYjF3YjFqbzAzZW8xcXBwdGpreWUifQ.1MJp33ncZBZleo5IIpEU4Q";
//   var map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/minhphambku5151/clw3av9mo01at01qugfl41sco",
//     center: [humidity, temperature],
//     zoom: 20,
//   });

//   var marker = new mapboxgl.Marker()
//     .setLngLat([humidity, temperature])
//     .addTo(map);

//   var popup = new mapboxgl.Popup({
//     offset: 30
//   })
//     .setLngLat([humidity, temperature])
//     .setHTML(`<p>Longitude: ${humidity}, Latitude: ${temperature} </p>`)
//     .addTo(map);

//   // Update the marker position with animation every 2 seconds
//   const updateData = setInterval(async () => {
//     const { humidity: newHumidity, temperature: newTemperature } =
//       await fetchDataFromFirebase();

//     // Interpolate marker and popup movement over 1 second
//     const duration = 1000; // 1 second
//     const numSteps = 10; // 60 steps for 1 second animation
//     const lngStep = (newHumidity - marker.getLngLat().lng) / numSteps;
//     const latStep = (newTemperature - marker.getLngLat().lat) / numSteps;

//     // Perform animation for marker
//     let step = 0;
//     const moveMarker = () => {
//       if (step < numSteps) {
//         const lng = marker.getLngLat().lng + lngStep;
//         const lat = marker.getLngLat().lat + latStep;
//         marker.setLngLat([lng, lat]);
//         step++;
//         setTimeout(moveMarker, duration / numSteps);
//       } else {
//         // When animation is complete, update marker's position to final destination
//         marker.setLngLat([newHumidity, newTemperature]);
//         map.flyTo({
//           center: [newHumidity, newTemperature],
//           zoom: 20,
//           speed: 0.5,
//         });
//       }
//     };

//     // Perform animation for popup
//     let popupStep = 0;
//     const movePopup = () => {
//       if (popupStep < numSteps) {
//         const lng = (popup.getLngLat().lng + lngStep).toFixed(3);
//         const lat = (popup.getLngLat().lat + latStep).toFixed(3);
//         popup.setLngLat([lng, lat]);
//         popup.setHTML(`<p>Longitude: ${lng}, Latitude: ${lat} </p>`);

//         popupStep++;
//         setTimeout(movePopup, duration / numSteps);
//       } else {
//         // When animation is complete, update popup's position to final destination
//         popup.setLngLat([newHumidity, newTemperature]);
//         popup.setHTML(`<p>Longitude: ${newHumidity}, Latitude: ${newTemperature} </p>`);

//       }
//     };

//     moveMarker();
//     movePopup();
//   }, 1000);

//   return map;
// }
