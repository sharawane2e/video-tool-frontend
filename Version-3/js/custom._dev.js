$(document).ready(() => {
$(".tool-container").prepend(`<div class="message-popup">
<div class="popup-closeIcon"><i class="fa-sharp fa-solid fa-circle-xmark"></i></div>
<div class="message">Video Tool Error Message!!</div>
</div>`);


$(".container").append(`<div class="wrapper">
<div class="video-timeline">
    <div class="progress-area">
        <div class="progress-bar"></div>
    </div>
</div>
</div>
  
<div class="overlay">
  <button class="play-pause"><i class="fas fa-play"></i><div class="current-time"></div></button>
</div>`);

$(".tool-container").append(`<div class="rating_container hide">
<div class="rating-text">
    <p>PLEASE KEEP RATING</p>
</div>

<div class="slider_container">
    
    <div class="range rating-range-container">
        <div class="slider-overlay"></div>
        <input type="range" steps="1" class="rating-range-slider">
    </div>
    <div class="range-labels-container">
        <div class="range-label">DISLIKE</div>
        <div class="range-label">NEUTRAL 50</div>
        <div class="range-label">LIKE</div>
    </div>
</div>

<div class="tuneout-cont">
    <div class="tuneout-button">
        <!-- <input type="checkbox" name="tuneout"> -->
        <div class="tuneout-icon"><img src="./images/Icon awesome-power-off.png"></div>
        <div class="tuneout-text">TUNE OUT</div>
    </div>
    <div class="tuneout-tooltip">Tune Out Placeholder Description</div>
</div>

<div class="review-cont">
    <div class="review-overlay"></div>
    <textarea class="comment" name="comment" id="" cols="30" rows="1" placeholder="Enter your comment..."></textarea>
    <div class="submit-btn">SUBMIT</div>
</div>

<div class ="popupButton-cont">
    <div class="popupButton">Show Popup</div>
</div>
</div>

<div class="next-btn"></div>
`);


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
var tuneout = false;
var firstLoad = true;


// Data Object 
let respId = 120;
let gender = " ";
let age = 20;
let country = " ";
let dataString = outputStr;

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
    if(firstLoad){
        var videoLoad = setInterval(() => {
            console.log(mainVideo.readyState);
            if(mainVideo.readyState == 4){
                clearInterval(videoLoad);
                firstLoad = false;
                $(".rating_container").removeClass("hide");
            }
        }, 500)
    }
    
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
    // console.log("DISABLE COMMENT")
    $(".submit-btn").css({"pointer-events": "none"});
    $(".comment").css({"pointer-events": "none"});
    document.querySelector(".comment").disabled = true;
    document.querySelector(".review-overlay").style.display = "block";
}

function enableComment() {
    // console.log("ENABLE COMMENT")
    $(".submit-btn").css({"pointer-events": "auto"});
    $(".comment").css({"pointer-events": "auto"});
    document.querySelector(".comment").disabled = false;
    document.querySelector(".review-overlay").style.display = "none";
}

function skipToEnd() {
    mainVideo.currentTime = mainVideo.duration;
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
    // console.log("Time", e.target.currentTime)
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
    // console.log(commentBox)
    commentBox.focus();
    controls.style.display = "none";
    enableComment()
});

$(".submit-btn").on("click", (e)=>{
    if($(".comment").val() == "")
            return;
    if(!tuneout){
        // console.log($(".comment").val() == "")
        // if($(".comment").val() == "")
        //     return;
        // console.log("SUBMIT BTN")
        videoPlay();
        // console.log(commentBox)
        // commentBox.focus();
        controls.style.display = "flex";
        // console.log(commentBox.value);
    }else if(tuneout){
        videoPlay();
        controls.style.display = "flex";
    }
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
    tuneout = true;
    // skipToEnd();
    controls.style.display = "none";
    videoPause();
    enableComment();
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
        if(!tuneout){
            outputStr = $('.output').val() + ", " + lastTime.toFixed(1) + ":" +  $(".rating-range-slider").val() + "^" + "~" + $(".comment").val();
            $('.output').val(outputStr);
        }else{
            outputStr = $('.output').val() + ", " + lastTime.toFixed(1) + ":" +  $(".rating-range-slider").val() + "^" + tuneOutVal + "~" + $(".comment").val();
            $('.output').val(outputStr);
            tuneout = false;
        }
    }
    else{
        outputStr = lastTime.toFixed(1) + ":" +  $(".rating-range-slider").val() + "^" + "~" + $(".comment").val();
        $('.output').val(outputStr);
    }

    $(".comment").val("");
    lastTime += interval;
}


$(".next-btn").click(() => {
    dataObject.data = outputStr;
    // dataString = outputStr;
    sendRespData(dataObject)
});

function brightcoveFunctionality() {
    var player = videojs('player');

      var WEB_VTT_KIND = "captions";

      function onLoadStart() {
      retrieveVideoCaptions();
      };

      function retrieveVideoCaptions() {
      textTracks = player.textTracks();
                  
      for (var i=0; i<textTracks.length; i++) {
          if (textTracks[i].kind !== WEB_VTT_KIND) {
          continue;
          }
          // add cuechange handler for when captions display/hide
          textTracks[i].oncuechange = onCaptionChange;
      }
      };

      function onCaptionChange() {
      window.setTimeout(function() {
          updateInlineStyles();
      }, 1);
      };

      function updateInlineStyles() {
      var element,
          textDisplayContainer,
          textDisplayChildren,
          textDisplayLength;
      
      element = player.el_.querySelector('.vjs-text-track-display');
      if (element.childNodes.length < 1) { return; }
          textDisplayContainer = element.childNodes[0];
          textDisplayChildren = textDisplayContainer.childNodes;
          textDisplayLength = textDisplayChildren.length;
                  
          if (textDisplayLength > 0) {
          for (var i=0; i<textDisplayLength; i++) {
              // inner text element
              textDisplayChildren[i].childNodes[0].style.cssText = "color:red;";
          }
          }
      };

      player.on("loadstart", onLoadStart);
}

brightcoveFunctionality();


function sendRespData(data){
    let apiStatusCode;
    fetch('http://182.73.21.22:39003/api/userinputs/insertdata', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then((response) => {
        apiStatusCode = response.status;
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    })
    .then((data) => {
        console.log("Data Saved in Database!", data);
    })
    .catch((error) => {
        if(apiStatusCode == 400){
            console.log("Error 400 - Bad Request! Check Payload", error)
        }
        else if(apiStatusCode == 404){
            console.log("The server can not find the requested resource.")
        }
        else if(apiStatusCode == 500){
            console.log("Internal Server Error - Data Not Saved !")
        }
    });
}
})