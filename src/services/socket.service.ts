import io from 'socket.io-client';
const baseUrl = process.env.API_ENDPOINT || '';
const socket = io(baseUrl);
export default socket;
