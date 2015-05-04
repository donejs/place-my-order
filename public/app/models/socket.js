import io from 'socketio';

let socket;

if(io) {
  socket = io.connect();
}

export default socket;
