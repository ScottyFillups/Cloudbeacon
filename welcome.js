function $(id) {
    return document.getElementById(id);
}
function _(cls) {
    return document.getElementsByClassName(cls);
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
function getTimePeriod(hour) {
    if (hour >= 5 && hour < 12) {
        return 'morning';
    }
    else if (hour >= 12 && hour < 18) {
        return 'afternoon';
    }
    else if (hour >= 18 && hour < 22) {
        return 'evening';
    }
    else {
        return 'night';
    }
}
function getWelcomeMsg(name, hours) {
    if (name == '') {
        return 'Hello, I don\'t think we\'ve met.';
    } else {
        return 'Good ' + getTimePeriod(hours) + ' ' + name + '.' + ' How are you?';
    }
}
function makeNameField() {
    var cont = document.createElement('div');
    var p = document.createElement('h2');
    var d = document.createElement('div');
    var b = document.createElement('button');
    cont.id = 'name-form';
    d.id = 'name-field';
    b.id = 'name-submit';
    p.id = 'prompt';
    b.innerHTML = 'submit';
    p.innerHTML = 'What\'s your name?';
    d.contentEditable = 'true';
    $('page').appendChild(cont);
    cont.appendChild(d);
    cont.appendChild(b);
    $('welcome-container').appendChild(p);
    b.addEventListener('click', function() {
        setCookie('name', $('name-field').innerHTML, 10000);
    });
}
function makeClearButton() {
    var c = document.createElement('button');
    c.id = 'clear';
    c.innerHTML = 'clear';
    $('form').appendChild(c);
    c.addEventListener('click', function() {
        setCookie('name', '', 1);
    });
}
function getDateMsg() {
    var d = new Date();
    var monthLookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayLookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return 'Today is ' + dayLookup[d.getDay()] + ', ' + monthLookup[d.getMonth()] + ' ' + d.getDate();
}
function makeDateMsg() {
    var today = document.createElement('h2');
    today.id = 'today';
    today.innerHTML = getDateMsg();
    $('welcome-container').appendChild(today);
}

var hours = new Date().getHours();
var name = getCookie('name');

$('welcome').innerHTML = getWelcomeMsg(name, hours);
if (name == '') {
    makeNameField();
} else {
    makeDateMsg();
    makeClearButton();
}



