const express = require('express')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//database
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mongo",
  user: "root",
  password: "",
  database: "chat",
  port: 3306
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");  
});

//
const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
 
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })

  con.query("SELECT Nume FROM room WHERE Nume='"+req.params.room+"'",function(err,result,field){
      if(result.length === 0)
      {
        var sql = "INSERT INTO room (nume) VALUES ('"+req.params.room+"')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted in rooms");
        })
      }
  })
 
})

server.listen(3000)

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
    var sql = "INSERT INTO users (nume,ID_ROOM) VALUES ('"+name+"', (SELECT ID FROM room where Nume='"+room+"') )";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted in users");
  })
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    var sql = "INSERT INTO messages (Message,ID_USER) VALUES ('"+message+"', (SELECT MAX(ID) FROM users where ID_ROOM=(SELECT ID FROM room where Nume='"+room+"') ))";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted in messages");
    })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})


function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}