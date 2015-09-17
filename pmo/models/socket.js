import io from 'socket.io-client';
// import EventEmitter from 'event-emitter';

let socket;
if(io && io.connect) {
  socket = io.connect();
}

export default socket;
// We either connect to SocketIO or return a dummy event emitter
// export default io ? io.connect() : new EventEmitter();
