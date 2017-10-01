//Simon Says
var computer = [];
var player = [];
var playerClickCount = 0;
var round = 0;
var highScore = 0;
var stats = 0;

function randomColor() {
  var random = Math.floor(Math.random() * 4 + 1);
  var color = null;
  if (random === 1) {
    color = ' G';
  } else if (random === 2) {
    color = ' R';
  } else if (random === 3) {
    color = ' Y';
  } else if (random === 4) {
    color = ' B';
  }
  return color;
}

var colors= {
  ' G': 'green',
  ' R': 'red',
  ' Y': 'yellow',
  ' B': 'blue'
}

function computerTurn() {
  computer.push(randomColor());
}

function playerClick(str) {
  player.push(' ' + str.substr(4,1).toUpperCase());
  $("#player").text(player);
}

function compare() {
  i = 0;
  while (computer[i] === player[i] && i <= playerClickCount) {
    i++;
  }
  return i <= computer.length - 1 ? false : true;
}

function blink(color) {
  $("." + colors[color]).removeClass("demo");
  setTimeout(function() {
    $("." + colors[color]).addClass("demo");
  }, 550); //controlls animation time should be > transition time
}

function playBack() {
  setTimeout(function() {
    var idx = 0;
    interval = setInterval(function() {
        blink(computer[idx])
        idx++;
        if (idx >= computer.length) {
          clearInterval(interval);
          idx = 0; // for further use;
        }
      }, 750) //this is the gap between intervals (each element animation)
     //$("#display").text("Your Turn");
  }, 1);
}


function firstAndLastTurn() {
  if (computer[playerClickCount] === player[playerClickCount]) {
    playerClickCount++
    computerTurn();
    round++;
    player = [];
    $("#computer").text(computer);
    $("#player").text("---");
    $("#compare").text("True");
    $("#round").text(round);
    //$("#display").text("Correct !!");
    playBack();
  } else {
    $("#display").text("You LOSE!");
    $("#compare").text("False");
    popUp();
    document.getElementById('myScore').value = round.parseInt();
  }
}

function compareSingle() {
  if (computer[playerClickCount] === player[playerClickCount]) {
    playerClickCount++;
    $("#computer").text(computer);
    $("#compare").text('True');
    //$("#display").text('Correct!');
  } else {
    $("#display").text("You LOSE!");
    $("#compare").text('False');
    popUp();
    document.getElementById('myScore').value = round;
  }
}

function playerTurn() {
  if (player.length < computer.length) {
    compareSingle()
  } else if (player.length === computer.length) {
    firstAndLastTurn();
    player = [];
    playerClickCount = 0;
  }
}

function popUp() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    $("#score").text(round);
    $("#computer1").text('Computer: ' + computer);
    $("#player1").text('You: ' + player);
}

//JQuery Game-Flow
$(document).ready(function() {

  $("#start").click(function() {
    computerTurn();
    playBack();
    //round++;
    $("#computer").text(computer);
    $("#display").text("Let's Play!"); //or --> alert("Your Turn");
    $("#round").text(round);
  });

  $('.box').click(function() {
    $(".box").removeClass("demo");
    $(this).fadeOut(100).fadeIn(100)
    substr = $(this).attr('class');
    playerClick(substr);
    playerTurn();
  });

/*
  $("#reset").click(function() {
    computer = [];
    player = [];
    playerClickCount = 0;
    if (round > highScore) highScore = round;
    round = 0;
    $("#computer").text("---");
    $("#player").text("---");
    $("#compare").text("---");
    $("#display").text("Press Start :)");
    $("#round").text("--");
    $(".box").css("box-shadow", "none");
  });
*/

  $("#stats").click(function() {
      if (stats){
        $("#gameStats").hide();
        stats = 0;
      } else {
        $("#gameStats").show();
        stats = 1;
      }

  });

    $("#logo").click(function() {
        //plant an easter egg, whatever...
    })

  $("#dev").click(()=>{$(".popup").hide()})

});

//add class constructor for user and highscore
//make it overwrite any previous scores, make it list highscore and option for all scores?
//Buld Neon anomation for computer sequence and also on mouse clicks
//CSS trigger example https://codepen.io/thetallweeks/pen/boinE
//setTimeout is adding the .demo CSS as the last function run.. Perhaps give .box a new #ID?
//body bg - #251d1d
//https://www.google.com.hk/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiWpKPMlMrWAhWHKY8KHeRCDsMQjRwIBw&url=http%3A%2F%2Fwww.typophile.com%2Fnode%2F83390&psig=AFQjCNH1qiomgNREURbAYyNZ84Ov1s-igg&ust=1506753127349802