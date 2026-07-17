const clients = new Map(); // userId string -> Set of Express Response objects

const registerClient = (userId, res) => {
  const userIdStr = userId.toString();
  if (!clients.has(userIdStr)) {
    clients.set(userIdStr, new Set());
  }
  clients.get(userIdStr).add(res);
};

const unregisterClient = (userId, res) => {
  const userIdStr = userId.toString();
  const userClients = clients.get(userIdStr);
  if (userClients) {
    userClients.delete(res);
    if (userClients.size === 0) {
      clients.delete(userIdStr);
    }
  }
};

const sendRealtimeNotification = (userId, notification) => {
  const userIdStr = userId.toString();
  const userClients = clients.get(userIdStr);
  if (userClients) {
    const data = JSON.stringify(notification);
    userClients.forEach(res => {
      try {
        res.write(`data: ${data}\n\n`);
      } catch (err) {
        console.error(`Error writing to SSE stream for user ${userIdStr}:`, err.message);
      }
    });
  }
};

module.exports = {
  registerClient,
  unregisterClient,
  sendRealtimeNotification
};
