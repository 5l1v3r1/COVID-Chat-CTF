var url = 'http://localhost:1337';
var socket = io.connect(url);

window.document.body.onload = ()=>{
    fetch(url+'/check').then(res=>res.text()).then(data=>console.log(data));    
}

var b = document.getElementById('send');
var c = document.cookie.split(';');
var k = c[0].split('=')[1];
var v = c[1].split('=')[1];
var r = c[2].split('=')[1];
var o = document.getElementById('output');

socket.emit('joinRoom', {room: r});

b.addEventListener('click', ()=>{

    let m = document.getElementById('message').value;
    let h = document.getElementById('handle').value;
    let s = 'Connected';

    let check = new RegExp(/[<>]/);
    var r1 = check.test(m);
    var r2 = check.test(h);

    if(r1 === true || r2 === true) {
        alert('Please don\'t!!!!!!!!!!');
        m = "-_-";
        h  = "-_-";
    }


    let eM = CryptoJS.AES.encrypt(m, k, {iv: v}).toString();
    let eH  = CryptoJS.AES.encrypt(h, k, {iv: v}).toString();
    let eS = CryptoJS.AES.encrypt(s, k, {iv: v} ).toString();

    socket.emit('chat', {
        mm: eM,
        hh: eH,
        ss: eS
    })
});

socket.on('chat', (data)=>{
    o.innerHTML = '<p><strong>'+ data.hh + ':</strong> ' + data.mm + '</p>';
    document.querySelector('i').innerHTML = data.ss;
});

