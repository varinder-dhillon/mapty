'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


let map, mapEvent;

// console.log(navigator.geolocation);

// get the location of an user
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
        const {latitude, longitude} = position.coords;
        const coords = [latitude, longitude]
        console.log(latitude, longitude);
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        

        map.on('click', function(ev) {
            console.log(ev); // ev is an event object (MouseEvent in this case)
            mapEvent = ev;
            form.classList.remove('hidden');
            inputDistance.focus();
        });
        
    }, function(){
        console.log("Could not get your location!!!");
    })

} else {
    console.log("Geolocation is not supported by this browser.");
}
  

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const {lat, lng} = mapEvent.latlng;
    L.marker([lat, lng]).addTo(map)
    .bindPopup(
        L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup'
        })
    )
    .setPopupContent("Working")
    .openPopup();
})

inputType.addEventListener('change', function(){
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
})