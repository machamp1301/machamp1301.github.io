
var buttonColours = ["red", "blue", "green", "yellow"];
var questionsandanswers=[
  {
    question: "What is the capital city of Nova Scotia",
    answers: ["Ottawa","Halifax","Toronto"],
    correct: 1
  },
  {
    question: "What is the capital city of Canada",
    answers: ["Ottawa","Halifax","Toronto"],
    correct: 0
  },
  {
    question: "What is the capital city of Ontario",
    answers: ["Ottawa","Tobermory","Toronto"],
    correct: 2
  },
  {
    question: "Who is the mayor of Brampton",
    answers: ["Patrick Brown","Doug Ford","John Tory"],
    correct: 0
  },
  {
    question: "When are the next Summer Olympics",
    answers: ["2023","2024","2025","2026"],
    correct: 1
  }
]

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

$(document).keypress(function() {
  if (!started) {
    console.log("value of started: " + started);
    $("#level-title").text("Level " + level);
    console.log("Value of level: "  + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function() {

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      wrongAnswer();
    }
}

function wrongAnswer(){
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over, Press Any Key to Restart");

  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  startOver();

}

function nextSequence() {
  console.log("entering the nextSequence");
  userClickedPattern = [];

  console.log("value of userClickedPattern in nextSequence(): " + userClickedPattern);
  level++;
  $("#level-title").text("Level " + level);

  // We will ask the question after every 3 questions. That will be on questions 4, 7, 10 etc..
  // When we ask the question, we will hide the rows with colours
      if (level > 1 && level % 3 === 1){
        prepareQuestion((level-4)/3);
      } else {
        preparePattern();
      }
}

function prepareQuestion(id) {
  console.log("inside the prepareQuestion");
  console.log($(".row"));
  $(".row").hide(); // hide the colours
  if (!questionsandanswers[id]) {preparePattern(); return false;}
  $(".question").html(questionsandanswers[id].question); //this is not very secure
  $(".answers").html("");
  questionsandanswers[id].answers.forEach(function(e,i){$(".answers").append(`<input type="radio" name="answers" id="answer_${i}" value="${i}"> <label for="answer_${i}">${e}</label><br>`)});
  $(".question, .answers").show();
  $(".answers").off('click');
  $(".answers").on('click', 'input', function (e) {
    validateAnswer(Number(e.target.value), id);
  });


}

function validateAnswer(e,id) {
  if(e === questionsandanswers[id].correct) {preparePattern()} else {wrongAnswer()};
}

function preparePattern() {
  console.log("Entering the gamePattern");
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  console.log("gamePattern is : "+ gamePattern);
  console.log("value of $('.row')" + $(".row"));
  $(".row").show();
  console.log("value of $(.question, .answers)" + $(".question, .answers"));
  $(".question, .answers").hide();

  $("#" + randomChosenColour).fadeIn(200).fadeOut(200).fadeIn(200);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  //let level = level.toString(1);
  var audio = new Audio("sounds/" + level + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
