const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Socket.IO Documentation BELOW

// Socket.IO Documentation ABOVE

const http = require("http");
const socketIO = require("socket.io");
const coinGecko = require("coingecko-api");
const CoinGeckoClient = new coinGecko();
const index = require("./routes/index");

app.use(index);

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", socket => {
  console.log("New client connected"),
    setInterval(() => getCoins(socket), 60000),
    getCoins(socket);
  socket.on("disconnect", () => console.log("Client disconnected"));
});
let page = 1;
const getCoins = async socket => {
  try {
    let coins = await CoinGeckoClient.coins.markets({ page });
    socket.emit("GetCoins", coins.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));
