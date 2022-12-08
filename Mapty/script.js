'use strict';

class Workout {
  date = new Date();
  id = String(Date.now()).slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in mi
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min per mi
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // mi/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/** Application  Architecture*/

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  // private class fields
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    /** Using the Geolocation API */
    if (navigator.geolocation) {
      // in a regular function call, the this keyword is set to
      // undefined, to solve this use bind to bind it to this app
      // object
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Position API Error');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling Map Click
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Clear Input Fields
    inputDistance.value = '';
    inputDuration.value = '';
    inputElevation.value = '';
    inputCadence.value = '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  } // end _hideForm

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const allPostive = (...inputs) => inputs.every(input => input > 0);
    event.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    // Check if data is valid

    // if workout running, create running object
    if (type == 'running') {
      // check if data is valid
      const cadence = Number(inputCadence.value);
      if (
        !validInputs(distance, duration, cadence) ||
        !allPostive(distance, duration, cadence)
      ) {
        return alert('Inputs have to be postive numbers!');
      } // end if

      workout = new Running([lat, lng], distance, duration, cadence);
    } // end if
    // if workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);
      if (
        !validInputs(distance, duration, elevation) ||
        !allPostive(distance, duration)
      ) {
        return alert('Inputs have to be postive numbers!');
      } // end if

      workout = new Cycling([lat, lng], distance, duration, elevation);
    } // end if
    // Add new obj to the workout array
    this.#workouts.push(workout);
    // Render workout on map as marker
    this._renderWorkout(workout);
    // Render workout on list
    this._renderWorkoutMarker(workout);
    // Hide form & clear  inpout fields

    // Display Marker

    this._hideForm();
  } // end _newWorkout

  _renderWorkoutMarker(workout) {
    const options = {
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: `${workout.type}-popup`,
    };

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(L.popup(options))
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  } // end renderWorkoutMarker

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
   <h2 class="workout__title">${workout.description}</h2>
   <div class="workout__details">
     <span class="workout__icon">${
       workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
     }</span>
     <span class="workout__value">${workout.distance}</span>
     <span class="workout__unit">mi</span>
   </div>
   <div class="workout__details">
     <span class="workout__icon">⏱</span>
     <span class="workout__value">${workout.duration}</span>
     <span class="workout__unit">min</span>
   </div>`;

    if (workout.type === 'running') {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
    } // end if

    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>`;
    } // end if

    form.insertAdjacentHTML('afterend', html);
  } // end of _renderWorkout

  _moveToPopup(event) {
    const workoutEl = event.target.closest('.workout');
    // guard
    if (!workoutEl) {
      return;
    }

    const workout = this.#workouts.find(
      workout => workout.id === workoutEl.dataset.id
    );
    const options = {
      animate: true,
      pan: {
        duraction: 1,
      },
    };
    this.#map.setView(workout.coords, this.#mapZoomLevel, options);
  } // end moveToPopup
} // end App

const app = new App();
