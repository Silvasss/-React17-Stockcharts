import { io } from 'socket.io-client';


// use WebSocket first, if available}
const socket2 = io('http://localhost:4000/', {transports: ["websocket", "polling"]})


export { socket2 }
