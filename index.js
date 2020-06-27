const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');
const CryptoJS = require('crypto-js');
const port = '1337';
const app = express();
var allRooms = [];
var logStatus = [];

const key = '6J2ZhFOUU3lBSyp3f4UH-ffqv1CroUxW_H-fhlvJoU-Hn9D8qosFX-QMNQblQzjB';
const iv = 'kXZFuoBzcXXWl3vCKeDjhG';

app.use('/', express.static('public', {

    setHeaders: function(res, path) {
        res.set('X-Content-Type-Options','nosniff');
        res.set('X-Frame-Options','Deny');
    }

}));

app.use(cookieParser());
app.use(express.static('public'));

var server =  app.listen(port);
var io = socket(server);

app.get('/check', (req, res)=>{

    res.cookie('k',key);
    res.cookie('v',iv);
    res.cookie('r','public');
    res.send('Play Smart! Don\'t let others know what you are testing!');
});

app.get('/26fc712ccc8f358d5aea2880bb5fc186abe5d528', (req, res)=>{
    res.send(`
        <html>
        <head>
        <meta http-equiv="refresh" content="5">
        <title flag="flag{Y0u_Re4lly_+B3K3d_c0V|d_r00m}">Adming console</title>
        </head>
        <body>
        <h1>Admin console!</h1><hr>
        <b>Last status!</b><br>
        <p>${logStatus[0]}</p>
        </body>
        </html>   
    `);
});

io.set('origins','*://*:1337');

io.on('connection', (socket)=>{  

    function decodeData(encData) {

       try {
            decData = CryptoJS.AES.decrypt(encData, key, {iv: iv}).toString(CryptoJS.enc.Utf8);
            return(decData);
       } catch (error) {
           console.log('Evil attacks');
       }
    }

    function validate(evilInput) {

        try {
            safeData = evilInput.replace(/[<>]/gim,"");
            return(safeData);
        } catch (error) {
            console.log('Evil attacks!');
        }

    }
   

    socket.on('joinRoom', room => {    

        socket.join(room.room);
        allRooms.push(room.room);
        console.log("Printing last created room: "+allRooms[allRooms.length -1]);
        
        io.to(room.room).emit('chat', {hh: '@Bot', mm: 'Welcome to COVID-19 chat!', ss: 'Connected'});
            
        socket.on('chat', (data)=>{

            data.mm = decodeData(data.mm);
            data.hh = decodeData(data.hh);
            data.ss = decodeData(data.ss);

            logStatus[0] = data.ss;
           
            data.mm = validate(data.mm);
            data.hh = validate(data.hh);

            io.to(room.room).emit('chat', data);
        });
    });   
    
});
