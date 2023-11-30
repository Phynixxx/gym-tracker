// Initializing variables
let data = JSON.parse(localStorage.getItem("appData"));
    
let username;
let welcomePopupBtn = document.querySelector(".enter-btn");
let closeWelcomePopup = document.querySelector(".ask-for-name-background");
let nameOutput = document.querySelector(".greetings");
let startWorkoutBtn = document.querySelector(".startbutton");
let workoutIsRunning;
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

nameOutput.addEventListener("click", function() {
    toggleWelcomePopup();
});

function reset() {
    localStorage.clear();
    window.location.reload(true);
}

function initExersiceEvents() {
    let allExersices = document.querySelectorAll(".exercise");

    allExersices.forEach(exercise => {
        exercise.addEventListener("input", function() {
            exerciseEvent(this);
        });
        exercise.addEventListener("change", function() {
            exerciseEvent(this);
            console.log("change");
        });    
        exercise.querySelector(".add-btn").addEventListener("click", function() {
            exerciseEvent(this.closest(".exercise"));
        });
    });
}

function exerciseEvent(obj) {

    let exerciseId = obj.dataset.id;
    let exerciseName = obj.querySelector(".exercisename").value;

    data.exercises[exerciseId] = {};
    data.exercises[exerciseId].exerciseName = exerciseName;
    data.exercises[exerciseId].sets = [];

    let sets = obj.querySelectorAll(".set");

    for (let i = 0; i < sets.length; i++) {

        let weight = sets[i].querySelector(".weight").value;
        let amount = sets[i].querySelector(".set-amount").innerHTML;
        let reps = sets[i].querySelector(".reps").value;

        data.exercises[exerciseId].sets[i] = {};
        data.exercises[exerciseId].sets[i].weight = weight;
        data.exercises[exerciseId].sets[i].amount = amount;
        data.exercises[exerciseId].sets[i].reps = reps;
    }
    saveAppData();
}


// Functions
function showName() {
    let callNameNode = document.querySelector(".call-name-note");

    if (username) {
        nameOutput.innerHTML = "Hi " + username + "!";

        if (!closeWelcomePopup.classList.contains("hidden")) {
            toggleWelcomePopup();
        }
    } else {
        callNameNode.innerHTML = "Bitte gib einen Namen ein";
    }
}

function toggleWelcomePopup() {
    closeWelcomePopup.classList.toggle("hidden");
}

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

    let lastExercise = exerciseContainer.lastElementChild;
    let lastExerciseId = lastExercise.dataset.id;

    exerciseContainer.append(newExercise);
    lastExercise = exerciseContainer.lastElementChild;
    lastExercise.dataset.id = parseInt(lastExerciseId) + 1;
    initExersiceEvents();
}

function togglePopup() {
    popUp.classList.toggle("hidden");
}

function startWorkout() {
    startWorkoutBtn.innerHTML = "WORKOUT BEENDEN";
    workoutIsRunning = true;
    workoutStartTime = Date.now();
    data.appConfig.workoutIsRunning = workoutIsRunning;
    data.appConfig.startTime = workoutStartTime;
    saveAppData();
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
    data.appConfig.workoutIsRunning = workoutIsRunning;
    data.appConfig.startTime = undefined;
    saveAppData();
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

        if (parseInt(weight) * parseInt(reps) > 0) {
            totalWeight = totalWeight + parseInt(weight) * parseInt(reps);
        }

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

function deleteSet() {
    let that = window.event.target;
    let exercise = that.closest(".exercise");
    that.closest(".set").remove();
    let allSets = exercise.querySelectorAll(".set");

    for (let i = 0; i < allSets.length; i++) {
        allSets[i].querySelector(".set-amount").innerHTML = (i + 1);
    }
    exerciseEvent(exercise);
}


// indextDB

//localStorage.clear();

function getUsername() {

    if (username !== null && username.length > 0) {
        showName();
    } else {
        toggleWelcomePopup();
    }
    
    document.querySelector(".enter-btn").addEventListener("click", function () {
        data.appConfig.username = document.querySelector(".your-name").value;
        username = data.appConfig.username;
        saveAppData();
        showName();
    });
}

// startup Functions
cloneElements();

if (data) {
    console.log("data has been set");
    loadAppData();
} else {
    console.log("no data has been set");
    initAppData();
}

getUsername();
initExersiceEvents();

function loadAppData() {
    workoutIsRunning = data.appConfig.workoutIsRunning;
    workoutStartTime = data.appConfig.startTime;

    username = data.appConfig.username;

    if (data.exercises.length > 0) {
        loadExercises();
    }

    if (workoutIsRunning) {
        updateTimer();
        startWorkoutBtn.innerHTML = "WORKOUT BEENDEN";
    }
}

function loadExercises() {
    let exerciseContainer = document.querySelector(".body");
    exerciseContainer.querySelector(".exercise").remove();
    let exercises = data.exercises;

    for (let i = 0; i < exercises.length; i++) {
        
        let newExercise = exerciseTemplate.cloneNode(true);
        let exerciseId = i;
        let exerciseName = exercises[i].exerciseName;
        let sets = exercises[i].sets;

        exerciseContainer.append(newExercise);
        lastExercise = exerciseContainer.lastElementChild;
        lastExercise.dataset.id = exerciseId;
        lastExercise.querySelector(".exercisename").value = exerciseName;

        let setContainer = lastExercise.querySelector(".grid-container");
        setContainer.querySelector(".set").remove();

        for (let i = 0; i < sets.length; i++) {
            
            let setAmount = sets[i].amount;
            let newSet = setTemplate.cloneNode(true);

            newSet.querySelector(".set-amount").innerHTML = setAmount;
            newSet.querySelector(".weight").value = sets[i].weight;
            newSet.querySelector(".reps").value = sets[i].reps;
            setContainer.append(newSet);
        }

        initExersiceEvents();
        
    }
}

function saveAppData() {
    localStorage.setItem("appData", JSON.stringify(data));
}

function initAppData() {
    data = {
        appConfig: {
          startTime: document.getElementById("timer"),
          workoutIsRunning: workoutIsRunning,
          username: document.querySelector(".your-name").value
        },
        exercises: []
      };
      saveAppData();
}
