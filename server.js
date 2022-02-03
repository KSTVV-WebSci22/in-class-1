// server init + mods
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { default: axios } = require('axios');
var mongoose = require('mongoose');
const apiKey = "d27c6a10c5107fa135a3ffbba98b99d5";
const cors = require('cors')  

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: [
      "GET"
  ],
  credentials: true
}));

// server route handler
app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.get('/getByZip/:zipcode', (req, res) => {

  const zip_code = req.params.zipcode;
  // Make a request for a user with a given ID

  let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip_code}&units=imperial&appid=${apiKey}`;

  axios.get(url)
    .then(e => {
      // console.log(e.data)
      res.send(e.data)
    })
    .catch(err =>{
      console.log(err)
    })
});

// connect to mongodb
var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://localhost/mychat');

// mongodb schemas
var chatMessage = new mongoose.Schema({
  username: String,
  message: String
});

var Message = mongoose.model('Message', chatMessage);

// user connected even handler
io.on('connection', function(socket){
  
  // log & brodcast connect event
  console.log('a user connected');
  
  // log disconnect event
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  // message received event handler
  socket.on('message', function(msg){
    // log chat msg
    console.log('message: ' + msg);
    
    // broadcast chat msg to others
    socket.broadcast.emit('message', msg);
    
    // save message to db
    var message = new Message ({
      message : msg
    });
    message.save(function (err, saved) {
      if (err) {
	      return console.log('error saving to db');
      }
    })
  });
});

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});