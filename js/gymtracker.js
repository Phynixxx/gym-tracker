// Initializing variables
let startWorkoutBtn = document.querySelector(".startbutton");
let workoutIsRunning = false;
let popupButton = document.querySelector(".finish");
let popUp = document.querySelector(".popupbackground");
let workoutStartTime;
let timeElapsed;
let timerInterval;

let moreSetBtn = document.querySelector(".moresets");
let moreExersiceBtn = document.querySelector(".moreexercises");
let setTemplate, exerciseTemplate;

let timerDisplay = document.getElementById("timer");

// EventListener
startWorkoutBtn.addEventListener("click", function() {
    if (!workoutIsRunning) {
        startWorkout();
    } else {
        stopWorkout();
    }
});

popupButton.addEventListener("click", function() {
    togglePopup();
});


function cloneElements() {
    let setNode = document.querySelector(".set");
    setTemplate = setNode.cloneNode(true);
    let exerciseNode = document.querySelector(".exercise");
    exerciseTemplate = exerciseNode.cloneNode(true);
}

function addNewSet() {
    console.log();
    let that = window.event.target;
    let setContainer = that.closest(".exercise").querySelector(".grid-container");
    let setAmount = setContainer.querySelectorAll(".set").length + 1;
    let newSet = setTemplate.cloneNode(true);
    newSet.querySelector(".set-amount").innerHTML = setAmount;
    setContainer.append(newSet);
}

function addNewExersice() {
    let exerciseContainer = document.querySelector(".body");
    let newExercise = exerciseTemplate.cloneNode(true);
    exerciseContainer.append(newExercise);
}

function togglePopup() {
    popUp.classList.toggle("hidden");
}

function startWorkout() {
    startWorkoutBtn.innerHTML = "WORKOUT BEENDEN";
    workoutIsRunning = true;
    workoutStartTime = Date.now();
    updateTimer(); 
}

function updateTimer() {
    timerInterval = setInterval(() => {
        timeElapsed = Math.floor((Date.now() - workoutStartTime) / 1000);

        let hours = Math.floor(timeElapsed / 60 / 60);
        let minutes = Math.floor((timeElapsed / 60) % 60);
        let seconds = Math.floor((timeElapsed) % 60);
        let milliseconds = Math.floor((Date.now() - workoutStartTime) % 1000);

        timerDisplay.innerHTML = hours.toString().padStart(2, "0") + ":" + 
        minutes.toString().padStart(2, "0") + ":" + 
        seconds.toString().padStart(2, "0") + "." + milliseconds.toString().padStart(3, "0");

    }, 10);
}

function stopWorkout() {
    startWorkoutBtn.innerHTML = "WORKOUT STARTEN";
    workoutIsRunning = false;
    clearInterval(timerInterval);
    timerDisplay.innerHTML = "00:00:00";
    calculateWeight();
    togglePopup();

}

function calculateWeight() {
    let allSets = document.querySelectorAll(".set");
    let totalWeight = 0;

    for (let i = 0; i < allSets.length; i++) {
        let weight = allSets[i].querySelector(".weight").value;
        let reps = allSets[i].querySelector(".reps").value;
        totalWeight = totalWeight + parseInt(weight) * parseInt(reps);
        console.log(weight, reps, totalWeight);
    }
    
    document.querySelector(".stats").innerHTML = "Du hast in<br>" + 
    Math.floor(timeElapsed / 60 / 60) + " Stunden " + 
    Math.floor((timeElapsed / 60) % 60) + " Minuten " + 
    Math.floor((timeElapsed) % 60) + " Sekunden<br>" + 
    totalWeight + " KG bewegt";
}

function hoverGlow() {
    let that = window.event.target;
    let allExercises = document.querySelectorAll(".exercise");

    for (let i = 0; i < allExercises.length; i++) {
        allExercises[i].classList.remove("active");
    }

    that.classList.add("active");
}


// startup Functions
cloneElements();
