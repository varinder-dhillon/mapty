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


class Workout {
    date = new Date();
    id =  (Date.now() + '').slice(-10);
    constructor(coords, distance, duration){
        this.coords = coords; // array of [lat, lng]
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    type = "running";
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace()
    }

    calcPace () {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = "cycling";
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed()
    }

    calcSpeed () {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}



// let map, mapEvent;

class App {
    #map;
    #mapEvent;
    #workouts = [];
    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this))
        
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
                console.log("Could not get your location!!!");
            })
        }
    }
     
    _loadMap(position){
        const {latitude, longitude} = position.coords;
        const coords = [latitude, longitude]
        console.log(latitude, longitude);
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(ev){
        console.log(ev); // ev is an event object (MouseEvent in this case)
        this.#mapEvent = ev;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField(){
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    }

    _newWorkout(e){
        e.preventDefault();
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        // get the form data
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;
        // check if the data is valid 

        // if workout running, create running obj
        if(type === 'running'){
            const cadence = +inputCadence.value;
            
            if(!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)){
                return alert("Inputs have to be positive numbers!!!");
            }
            workout = new Running([lat, lng], distance, duration, cadence);
        }
        // if workout is cycling, create cycling obj
        if(type === 'cycling'){
            const elevation = +inputElevation.value;

            if(!validInputs(distance, duration, elevation) || !allPositive(distance, duration)){
                return alert("Inputs have to be positive numbers!!!");
            }
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        
        // Add new obj to workout array
        this.#workouts.push(workout);

        //  render workout on the map as marker
        this._renderWorkoutMarker(workout)

        // render wotkout list

        // Hide form + clear form fields
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ''
    }

    _renderWorkoutMarker (workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            })
        )
        .setPopupContent(workout.distance+ "")
        .openPopup();
    }
}
  
const app = new App();


