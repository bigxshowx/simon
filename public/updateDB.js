const http = new XMLHttpRequest();
const url = 'https://jsonplaceholder.typicode.com/posts';
var ajaxResponse;
var count = 0;
var test = '';

//random HTTP AJAX
http.onreadystatechange = function() {
  if (http.readyState === 4 && http.status === 200){
     ajaxResponse = (JSON.parse(http.responseText)[3].body).substr(1,10);
     var text = document.getElementById('fts');
     count++;
     text.innerHTML = '------>' + ajaxResponse + ' ' + count;
     document.getElementById('myScore').value = count;
     console.log(ajaxResponse);
  } else if (http.readyState === http.DONE && http.status !== 200) {
     console.log('Error!');
  }
};


var update = document.getElementById('update');
var changeName = document.getElementById('changeName');
var changeScore = document.getElementById('changeScore');
var change = document.getElementById('change');
update.addEventListener('click', function(){
    //http.open(method, url);
    //http.send();
    fetch('scores', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': changeName.value,
            'score': changeScore.value
        })
    }).then(res => {
        document.getElementById('change').innerHTML = res;
        window.location.reload(true);
     });
});

var delForm = document.getElementById('delForm');
var delButton = document.getElementById('delButton');
delButton.addEventListener('click', function(){
    fetch('scores', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': delForm.value,
        })
    }).then(res => {
        if (res.ok) return res.json();
    }).then(data => {
        console.log(data);
        //input some react here to update the DOM dynamically!!
        document.getElementById('del').innerHTML = data;
        //window.location.reload(true);
        //setTimeout(() => alert(data.message), 1000);
    });
    //setTimeout(() => document.getElementById('del').innerHTML = test, 1000);
});

function sendAJAX(){
  //For form inputvalue, use below code:
  //var zip = document.getElementById('zip').value;
  http.open('GET', url);
  http.send();
  console.log('working');
}
