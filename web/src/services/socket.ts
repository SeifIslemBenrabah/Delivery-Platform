import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost/ws';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = localStorage.getItem('accessToken');
    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

// ─── Tracking events ─────────────────────────────────────────────────────
export function subscribeToOrderTracking(
  orderId: string,
  onPosition: (pos: { lat: number; lng: number; timestamp: string }) => void,
  onStatusChange: (status: string) => void
) {
  const s = getSocket();
  s.emit('tracking:subscribe', { orderId });
  s.on(`tracking:position:${orderId}`, onPosition);
  s.on(`tracking:status:${orderId}`, onStatusChange);

  return () => {
    s.emit('tracking:unsubscribe', { orderId });
    s.off(`tracking:position:${orderId}`, onPosition);
    s.off(`tracking:status:${orderId}`, onStatusChange);
  };
}

export function emitLivreurPosition(lat: number, lng: number) {
  getSocket().emit('livreur:position', { lat, lng });
}