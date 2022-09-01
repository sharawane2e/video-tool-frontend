const container = document.querySelector(".container");
var mainVideo = container.querySelector("video");
var progressBar = container.querySelector(".progress-bar");
var currentVidTime = container.querySelector(".current-time");
var playPauseBtn = container.querySelector(".play-pause");
var playPauseIcon = container.querySelector(".play-pause i");
var controls = container.querySelector(".overlay");
var slider = document.querySelector(".rating-range-slider");
var commentBox = document.querySelector(".comment");

var outputStr = "";


let timer;
var lastSecSliderChange = 0;
var nextOutputUpdateTime = interval;
var lastTime = 0.0;
var sliderValues = [];

// Data Object 
let respId = 120;
let gender = " ";
let age = 20;
let country = " ";
let dataString = " ";

let dataObject = {
    "respId": respId,
    "gender": gender,
    "age": age,
    "country": country,
    "data": dataString
}


const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        controls.style.opacity = "0";
    }, 1000);
}

initializeSlider();
hideControls();
updateOutput();
videoPause();
disableComment();
disableSlider();

function initializeSlider(){
    document.querySelector(".rating-range-slider").max = max;
    document.querySelector(".rating-range-slider").min = min;
    document.querySelector(".rating-range-slider").value = defaultValue;

}


function videoPause() {
    mainVideo.pause();
    $('.rating-text p').css("animation-name", "none").css("opacity", "0");
    // disableSlider();
}

function videoPlay() {
    mainVideo.play();
    $('.rating-text p').css("animation-name", "textBlink").css("opacity", "1");
    enableSlider();
    disableComment();   
}

function disableSlider(){
    $('.slider-overlay').css({"display": "block"});
    slider.disabled = true;
}

function enableSlider(){
    $('.slider-overlay').css({"display": "none"});
    slider.disabled = false;
}

function disableComment() {
    console.log("DISABLE COMMENT")
    $(".submit-btn").css({"pointer-events": "none"});
    $(".comment").css({"pointer-events": "none"});
    document.querySelector(".comment").disabled = true;
    document.querySelector(".review-overlay").style.display = "block";
}

function enableComment() {
    console.log("ENABLE COMMENT")
    $(".submit-btn").css({"pointer-events": "auto"});
    $(".comment").css({"pointer-events": "auto"});
    document.querySelector(".comment").disabled = false;
    document.querySelector(".review-overlay").style.display = "none";
}

function skipToEnd() {
    
}

container.addEventListener("mousemove", () => {
    controls.style.opacity = "1";
    clearTimeout(timer);
    hideControls();   
});


mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
    if(currentTime >= nextOutputUpdateTime){
        nextOutputUpdateTime += interval;
        updateOutput();
    }
    console.log("Time", e.target.currentTime)
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

playPauseBtn.addEventListener("click", () => {
    mainVideo.paused ? videoPlay() : videoPause();
    mainVideo.paused ? enableComment() : disableComment();
});
mainVideo.addEventListener("play", () => playPauseIcon.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseIcon.classList.replace("fa-pause", "fa-play"));



$(".range").on("change", () => {
    var timeInSec = Math.floor(mainVideo.currentTime);
    var mins = Math.floor(timeInSec / 60);
    var secs = Math.floor(timeInSec % 60);
    // console.log(mins + ": Mins", secs + ": Secs")
    // $('.output').val($('.output').val() + ", " + mainVideo.currentTime.toFixed(2) + ":" +  $(".rating-range-slider").val());
    mainVideo.pause();
    console.log(commentBox)
    commentBox.focus();
    controls.style.display = "none";
    enableComment()
});

$(".submit-btn").on("click", (e)=>{
    
    console.log($(".comment").val() == "")
    if($(".comment").val() == "")
        return;
    console.log("SUBMIT BTN")
    videoPlay();
    console.log(commentBox)
    // commentBox.focus();
    controls.style.display = "flex";
    console.log(commentBox.value);
})

$(".comment").on("keyup", (e)=> {
    mainVideo.pause();
    var isValid = true;
    var comment = e.target.value;
    isValid = checkValidComment(comment);

    if(!isValid)
        e.target.value = comment.slice(0, -1);
    
    if(e.target.value.trim() === "")
        e.target.value = e.target.value.trim();
});

$(".popupButton").click(() => {
    $(".message-popup").css({"display": "block"});
});

$(".popup-closeIcon").click(() => {
    $(".message-popup").css({"display": "none"});
});

$(".tuneout-button").click(() => {

});

function checkValidComment(comment){
    var regex = /[^0-9]/;
    return regex.test(comment);
}


function customOutputFunc(){
    var dataInfo = $(this).attr("data-info");
    $('.output').val(dataInfo + ", " + Math.abs(mainVideo.currentTime));
}



function updateOutput() {
    var timeInSec = Math.floor(mainVideo.currentTime);
    var mins = Math.floor(timeInSec / 60);
    var secs = Math.floor(timeInSec % 60);
        
    if(mainVideo.currentTime > interval){
        outputStr = $('.output').val() + ", " + lastTime.toFixed(1) + ":" +  $(".rating-range-slider").val() + "~" + $(".comment").val();
        $('.output').val(outputStr);
    }
    else{
        outputStr = lastTime.toFixed(1) + ":" +  $(".rating-range-slider").val()+ "~" + $(".comment").val();
        $('.output').val(outputStr);
    }

    $(".comment").val("");
    lastTime += interval;
}


$(".next-btn").click(() => {
    // sendRespData(dataObject)
    console.log(outputStr)
});





function sendRespData(data){
    // fetch('http://localhost:5000/userinputs/insertdata', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Content-type': 'application/json; charset=UTF-8'
    //     }
    // }).then(function (response) {
    //     if (response.ok) {
    //         return response.json();
    //     }
    //     return Promise.reject(response);
    // }).then(function (data) {
    //     console.log(data);
    // }).catch(function (error) {
    //     console.warn('Something went wrong.', error);
    // });
    console.log(data)
}
