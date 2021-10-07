// ipify API Key
const apiKey = "at_NacrplOpYQbW70gYZJtVlPStK7SKI";

// The input field loader
const loader = document.querySelector('.loader');

// The error element
const error = document.querySelector('.error');

// The submit button
const submitBtn = document.querySelector('button');
// The search form
const pageForm = document.querySelector('form');

// LEAFLET INITIALISATION
let mymap = L.map('map', {
  center: [38.89511, -77.03637],
  zoom: 13
});



// The UI class
class UI {
  updateUi(data) {
    let ip = document.querySelector('.ip'),
      loca = document.querySelector('.location'),
      timezone = document.querySelector('.timezone'),
      isp = document.querySelector('.isp');

    ip.innerText = data.ip;
    loca.innerText = `${data.location.city}, ${data.location.country}`;
    timezone.innerText = `UTC ${data.location.timezone}`;
    isp.innerText = data.isp;
  }
}

// The search class
class Search {
  static find(ip) {
    // the ipify API
    let result = fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ip}`);

    return result;
  }
}

function initial(mymap) {
  pageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loader.style.display = "block";
    error.style.display = "none";

    const search = new Search();
    const ui = new UI();

    // The input element
    const inputedIp = document.getElementById("search").value;

    Search.find(inputedIp)
      .then(res => {
        return res.json()
      })
      .then(data => {
        ui.updateUi(data);
        loader.style.display = "none";

        mymap.setView([data.location.lat, data.location.lng], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1
        }).addTo(mymap);

        L.marker([data.location.lat, data.location.lng]).addTo(mymap);

      })
      .catch(err => {

        if (err.message === "Failed to fetch") {
          error.innerText = "You're currently offline";
          error.style.display = "inline-block";
          loader.style.display = "none";
        }

      })
  })
}


// This initiates the map on the page and gets the user ip address
document.addEventListener('DOMContentLoaded', function () {
  // UI class initialisation
  const ui = new UI();

  fetch('https://api.ipify.org/?format=json')
    .then(response => {
      return response.json();
    })
    .then(ip => {
      Search.find(ip.ip)
        .then(reponse => {
          return reponse.json();
        })
        .then(data => {
          ui.updateUi(data);
          mymap.setView([data.location.lat, data.location.lng], 13);
        })
    })

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mymap);



  // This function adds an event listener to the input field
  initial(mymap);
})