// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Firebase configuration
const firebaseConfig = {

};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);

// Function to fetch real-time data from Firebase
// export function fetchMoreDataFromFirebase() {
//   const database = firebase.database();
//   const batteryData = database.ref("more_data/battery");
//   const lngData = database.ref("more_data/lng");
//   const latData = database.ref("more_data/lat");
//   const directionData = database.ref("more_data/direction");
//   const heightData = database.ref("more_data/height");
//   const pressureData = database.ref("more_data/pressure");
//   const temperatureData = database.ref("more_data/temperature");

//   batteryData.on("value", function (getbattery) {
//     let battery = getbattery.val();
//     document.getElementById("battery-value").innerHTML = battery + "%";
//   });
//   lngData.on("value", function (getlng) {
//     let lng = getlng.val();
//     document.getElementById("lng-value").innerHTML = lng;
//   });
//   latData.on("value", function (getlat) {
//     let lat = getlat.val();
//     document.getElementById("lat-value").innerHTML = lat;
//   });
//   directionData.on("value", function (getdirection) {
//     let direction = getdirection.val();
//     document.getElementById("direction-value").innerHTML = direction +  "&deg;" ;
//   });
//   heightData.on("value", function (getheight) {
//     let height = getbattery.val();
//     document.getElementById("height-value").innerHTML = height + "m";
//   });
//   pressureData.on("value", function (getpressure) {
//     let pressure = getpressure.val();
//     document.getElementById("pressure-value").innerHTML = pressure + "mbar";
//   });
//   temperatureData.on("value", function (gettemperature) {
//     let temperature = gettemperature.val();
//     document.getElementById("temperature-value").innerHTML =
//       temperature + "&#8451;";
//   });
// }

export function fetchMoreDataFromFirebase() {
  const database = firebase.database();
  const dataRefs = {
    battery: "battery-value",
    lng: "lng-value",
    lat: "lat-value",
    direction: "direction-value",
    height: "height-value",
    pressure: "pressure-value",
    temperature: "temperature-value",
  };

  const suffixes = {
    battery: "%",
    direction: "&deg;",
    height: "m",
    pressure: "mbar",
    temperature: "&#8451;",
  };

  Object.keys(dataRefs).forEach((key) => {
    database.ref(`more_data/${key}`).on("value", (snapshot) => {
      // const value = snapshot.val();
      let value = snapshot.val();
      if (key === "pressure" || key === "temperature" || key === "height") {
        value = value / 100;
      }
      if (key === "lng" || key === "lat") {
        value = value / 1000000;
      }
      const suffix = suffixes[key] || "";
      document.getElementById(dataRefs[key]).innerHTML = value + suffix;
    });
  });
}

export function fetchDataFromFirebase() {
  return new Promise((resolve, reject) => {
    const database = firebase.database();
    const lngData = database.ref("more_data/lng");
    const latData = database.ref("more_data/lat");

    let longitude, latitude;

    lngData.on("value", function (getlng) {
      longitude = getlng.val();
      if (longitude !== undefined && latitude !== undefined) {
        resolve({ longitude, latitude });
      }
    });

    latData.on("value", function (getlat) {
      latitude = getlat.val();

      if (longitude !== undefined && latitude !== undefined) {
        resolve({ longitude, latitude });
      }
    });
  });
}
