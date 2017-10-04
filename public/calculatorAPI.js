//Operator Functions
function add(n1, n2) {
  return n1 + n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

function percent(n1, n2) {
  return n1 + (n1 * (n2 * 0.01));
}

function pctStored(n1, n2) {
  return parseFloat((n1 * (n2 * 0.01)).toFixed(10));
}

function sqrt(n) {
  return Math.sqrt(n);
}

//Object to map the operator symbols to the function values
var operatorsObject = {
  '-': subtract,
  '*': multiply,
  '+': add,
  '/': divide,
  '%': percent,
  '√': sqrt
}

//Store numbers as selected in an array
var nums1 = [];
var nums2 = [];
var value1 = 0;
var value2 = null;
var display = null;
var operator = null;
var equal = null;
var pctMem;
var memory = 0;
var layout = "classic";
var weatherMode;
var weatherZip = [];

//Display Formatting Functions:

function formatCommas(num) {
  //adds commas per thousands to values, accounts for decimal values.
  var wholeNumbers = num.toString().split(".");
  wholeNumbers[0] = wholeNumbers[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return wholeNumbers.join(".");
}

function removeComas(str) {
  return str.replace(/[,]/g, '')
}

function noRunningZeros(str) {
  //Removes any extra zeros before the decimal with Regular Expression
  newStr = str.toString().replace(/(^[0])\1+/, '0');
  return newStr.length > 15 ? newStr.slice(0, 15) : newStr;
}

function doOperation() {
  result = operatorsObject[operator](parseFloat(value1), parseFloat(value2));
  return formatCommas(noRunningZeros(result));
}

//Calculator Button logic functions:

function keyClick(key) {
  if (weatherMode) {
    weatherZip.push(key);
    //next line ensures a zero cannot be first digit in display unless a decimal
    $("#display").text(weatherZip.join(''));
  }
  //if no operator clicked yet, then store num1 selections as array then join
  else if (operator === null) {
    nums1.push(key);
    //next line ensures a zero cannot be first digit in display unless a decimal
    if ((nums1.length > 1) && (nums1[0] === '0') && (nums1[1] !== '.')) nums1 = nums1.slice(1);
    value1 = nums1.join('');
    $("#display").text(formatCommas(noRunningZeros(value1)));
  } else {
    nums2.push(key);
    if ((nums2.length > 1) && (nums2[0] === '0') && (nums2[1] !== '.')) nums2 = nums2.slice(1);
    value2 = nums2.join('');
    memory = doOperation();
    $("#display").text(formatCommas(noRunningZeros(value2)));
  }
}

function operatorButton(key) {
  //show the operator but store the previous number to memory
  operator = key;
  if (value2 === null) {
    if (!isNaN(removeComas($("#display").text()))) {
      memory = removeComas($("#display").text());
    }
    $("#display").text(operator);
  } else {
    $("#display").text(formatCommas(memory));
    value1 = removeComas(memory);
    value2 = null;
    nums2 = [];
    nums1 = [];
    pctMem = 0;
  }
}

/*
This function is new approch where button take's the display as it's input!!!!
more efficient than other logic of stored memory???  Either way a shortcut
*/
function sqrtButton() {
  input = ($("#display").text()).toString().replace(/[',']/ig, '');
  value1 = parseFloat(sqrt(input))
  $("#display").text(formatCommas(value1));
}


/*
can potentially refactor all Operators this way as it pulls the value directly from display instead of mem...
  //input = ($("#display").text()).toString().replace(/[',']/ig, '');
*/
function pctButton() {
  var input;
  if (pctMem || value2 === null) {
    input = parseFloat((value1 * .01).toFixed(10));
    memory = value1 = input.toString();
    pctMem = 1;
  } else {
    input = pctStored(value1, value2);
    value2 = input;
    memory = doOperation();
  }
  $("#display").text(formatCommas(input));
}

function decimalButton(key) {
  //if value already includes a decimal then do nothing, but if doesn't include then
  //add it, !false = true to run the code to add the decimal.
  if (operator === null) {
    if (nums1.length === 0) {
      keyClick('0');
      keyClick(key);
    } else {
      if (!nums1.includes(key)) {
        keyClick(key);
      }
    }
  } else {
    if (nums2.length === 0) {
      keyClick('0');
      keyClick(key);
    } else {
      if (!nums2.includes(key)) {
        keyClick(key);
      }
    }
  }
}

function weather() {
  //  this will make the API call and display the result when invoked!weather()
  console.log('link to the api');
  alert('WIP');
}


function equalsButton() {
  if (weatherMode) {

    //weather();
    createURL();

  } else if ((operator !== null) && (value2 === null)) {
    opEq = operatorsObject[operator](parseFloat(removeComas(memory)), parseFloat(removeComas(memory)));
    value1 = opEq;
    value2 = removeComas(memory);
    $("#display").text(formatCommas(opEq));
  } else {
    $("#display").text(doOperation());
    memory = removeComas($("#display").text());
    value1 = memory;
    pctMem = true;
    nums2 = [];
  }
}

function clearButton() {
  nums1 = [];
  nums2 = [];
  operator = null;
  value1 = 0;
  value2 = null;
  equal = null;
  pctMem = 0;
  memory = 0;
  $("#display").text('0');
}


var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200){
    const profile = JSON.parse(xhr.responseText);
    let forcast;
  let city;
  if (profile.response.error){
    forcast = 'No Such City';
    weatherZip = [];
  }else{
    forcast = Math.round(profile.current_observation.temp_f) + '°F' + ', ' + profile.current_observation.weather;
          city = profile.location.city + ', ' + profile.location.state;
    document.getElementById('city').innerHTML = city;
    setTimeout(function(){$('#city').fadeIn(2000)}, 1000);
    weatherZip = [];
    //console.log(city);  
      }      
    document.getElementById('display').innerHTML = forcast.substr(0,20);
  } else if (xhr.readyState === xhr.DONE && xhr.status !== 200) {
     console.log('Error! ' + xhr.status);
  }
}

function createURL(){
  $("#city").hide();
  var zip = $("#display").text();
  url = `http://api.wunderground.com/api/a0f0ac9ccac18b6d/geolookup/conditions/forecast/q/${zip}.json`;
  xhr.open('GET', url);
  xhr.send();
}



//Calculator buttons use JQuery, Pass whatever Keypad button clicked or pressed to the accociated button function
$(document).ready(function() {


  $(".key").click(function() {
    //Pass whatever Keypad button clicked to the keyClick function
    keyClick($(this).text());
  });

  $("#theme").click(function() {
    //change CSS to original design, old logic --> $("#container").css("background-color") === "classic"

    if (layout === "classic") {
      $("body").css("background-color", "#cacece")
      $("#container").css("background-color", "#948e8c");
      $("#display").css("background-color", "#bccd95");
      $(".key, #key_decimal").css({
        "background-color": "#565352",
        "color": "white"
      });
      $(".operator, #key_pct, #key_sqrt").css({
        "background-color": "#ec694d",
        "color": "white"
      });
      $("#equals").css({
        "background-color": "#ff4561",
        "border": "1px solid white",
        "color": "white"
      });
      $("#clear").css({
        "background-color": "green",
        "border": "1px solid white",
        "color": "white"
      });
      layout = "original";
    } else {
      //$("#css").replaceWith('<link id="css" rel="stylesheet" type="text/css" href="style.css?t=' + Date.now() + '">');
      $("#container").css("background-color", "white");
      $("#display").css("background-color", "white");
      $(".key, #key_decimal, body").css({
        "background-color": "white",
        "color": "black"
      });
      $(".operator, #key_pct, #key_sqrt").css({
        "background-color": "white",
        "color": "black"
      });
      $("#equals").css({
        "background-color": "white",
        "border": "1px solid black",
        "color": "black"
      });
      $("#clear").css({
        "background-color": "white",
        "border": "1px solid green",
        "color": "black"
      });
      layout = "classic";
    }
  });

  $(".operator").click(function() {
    //show the operator but store the previous number to memory  
 if (weatherMode) {
 }else{
    if (operator !== $("#this").text()) {

      (operatorButton($(this).text()))

    }
  }
  });


  $("#key_sqrt").click(function() {
    if (weatherMode) {
    }else{
      sqrtButton();
    }
  });


  $("#key_pct").click(function() {
    if (weatherMode) {
    }else {
      pctButton();
    }
  });

  $("#display").click(function() {
    $("#key_sqrt, .operator, #key_decimal, #key_pct").toggleClass("weather");
    if (weatherMode) {
      weatherMode = false;
      clearButton();
      $("#display").text("Welcome Back :)");
      weatherZip = [];
      $('#city').hide();
    } else {
      $("#display").text("Enter your ZIP");
      //Trigger some function to disable the keyClick function and instead equals button is the API call...
      weatherMode = true;
      //toggle formating so only num_keys and Clear button are visible...
    }
  });


  $("#key_decimal").click(function() {
      decimalButton($(this).text());
  });


  $("#equals").click(function() {
    equalsButton();
  });

  $("#clear").click(function() {
    if (weatherMode) {
      weatherZip = [];
      $("#display").text("Enter your ZIP");
      $("#city").hide();
    } else {
      clearButton();
    }
  });

  //Key Pad Support
  var numPad = {
    '106': multiply,
    '42': '*',
    '107': add,
    '43': '+',
    '109': subtract,
    '45': '-',
    '110': 'decimal point',
    '111': divide,
    '47': '/',
    '13': 'Enter'
      //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
      //https://stackoverflow.com/questions/1898129/javascript-subtract-keycode
  }

  $(document).on("keypress", (function(event) {
    /*
        //Using "kepress" and "e.which" supported by most browsers but "keyCode" is
        //not so may need to eventually add the ACCII 'keyCode' mappings, see above URLs for more details, ACCI - 48 = 
    keypress --> https://www.quirksmode.org/js/keys.html
    */
    keyStroke = null;
    if ((event.which >= 48 && event.which <= 57)) {
      keyStroke = String.fromCharCode(event.which)
      keyClick(keyStroke);
    } else if ((event.which === 46)) {
      decimalButton('.');
    } else if ((event.which >= 42 && event.which <= 47)) {
      operatorButton(numPad[event.which]);
    } else if ((event.which === 13 || event.which === 61)) {
      equalsButton();
    } else if ((event.which === 99)) {
      clearButton();
    }

  }));


  //end of the (doc).ready JQery script
});

//fix the header/footer also keys look a px or two off to the left
//make responsive - optomize for phone
//picture scrambler, generate randome number and assign it to a new element ID using jquery dom manipulaiton
//can build out the tape by adding every display to an array then print the arr to the side bar...
//PUSH TO GITHUB ! ! ! 
//DONE - ******** Enable the Weather API for the display *********
//DONE - remove lobster font
//update Theme button to a simpler CSS toggle method
//refactor formatting to remove commas...  One single function
//DONE -- build out functionality for clear key, not sure which to use yet
//DONE -- apply the logic to fit results into diplay window same as typing...
//DONE -- Animate button mouse over, maybe
//DONE -- fix the multiple operator button hits
//DONE -- Fix the % button bugs that Hriday found

/*
//ALL test cases passed!!!--> http://mozilla.github.io/calculator/test/
Percentage Key Test Cases:
  10,000, +, 8, %, =, =, =, =, % // should equal 132
   = // 800+132 should be 932 = //1,732 and so on
  * 5 = --- > 135 * 5 = 660 = 3300
  * 5 + 9340 = 10,000 = 19,340
  * 5 + 9340 + 8 % = = = % //Back to 132
  10,000 + 8 + % + = //21,600 then 32,400...
*/