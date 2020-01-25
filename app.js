let express = require('express')
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, () => {
    console.log("Server listener port 3000")
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {

    console.log('New socket connection', socket.id, socket.handshake.query);

    io.sockets.emit('server2client', {
        type: 'Connect',
        id: socket.id,
        data: socket.handshake.query
    });

    socket.on('client2server', (data) => {
        io.sockets.emit('message', {
            type: 'Message',
            id: socket.id,
            data: data
        });
    })

    socket.on('disconnect', () => {
        io.sockets.emit('server2client', {
            type: 'Disconnect',
            id: socket.id,
            data: ""
        });
    })

    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', (data) => {
    //     console.log(data);
    // });
});