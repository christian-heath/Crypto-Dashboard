import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import LoadingSpinner from "./components/LoadingSpinner";
import "react-table/react-table.css";
import "./App.css";
const CoinGecko = require("coingecko-api");
const CoingeckoClient = new CoinGecko();

class App extends Component {
  constructor() {
    super();
    this.state = {
      Price: false,
      endpoint: "http://127.0.0.1:3001",
      Name: "",
      operationInProgress: true,
      Coins: [],
      firstPage: false,
      lastPage: false
    };
  }
  async componentDidMount() {
    await this.getTop100Coins();
  }
  getTop100Coins = async () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("GetCoins", coins =>
      this.setState({
        Coins: coins,
        operationInProgress: false,
        firstPage: true
      })
    );
  };
  fetchCoin = async () => {
    let coin = await CoingeckoClient.coins.fetch("bitcoin", {});
    this.setState({ Name: coin.data.name });
  };
  formatBigNumbers(num) {
    var twoDecimalString = num.toFixed(2);
    var twoDecimalNumber = Number(twoDecimalString);
    return twoDecimalNumber.toLocaleString();
  }
  formatMarketCap(MC) {
    if (MC < 1000000) {
      return (MC / 1000).toFixed(2) + "K";
    }
    if (MC < 1000000000) {
      return (MC / 1000000).toFixed(2) + "M";
    }
    if (MC > 1000000000) {
      return (MC / 1000000000).toFixed(2) + "B";
    }
  }
  render() {
    let { Coins } = this.state;
    console.log(Coins);
    Coins = Coins.map(coin => (
      <tr key={coin.id}>
        <th scope="row" className="coin-symbol">
          {coin.symbol}
        </th>
        <td>
          <img className="icon" src={coin.image} />
        </td>
        <td>{coin.name}</td>
        <td>
          $
          {coin.current_price > 0.99
            ? this.formatBigNumbers(coin.current_price)
            : coin.current_price}
        </td>
        <td>
          {coin.market_cap > 1000
            ? this.formatMarketCap(coin.market_cap)
            : coin.market_cap}
        </td>
        <td>{this.formatBigNumbers(coin.circulating_supply)}</td>
        <td
          className={
            coin.market_cap_change_percentage_24h > 0 ? "positive" : "negative"
          }
        >
          {coin.market_cap_change_percentage_24h.toFixed(2)}%
        </td>
      </tr>
    ));
    if (this.state.operationInProgress) {
      return (
        <div className="loadingSpinner">
          <LoadingSpinner loading={this.state.operationInProgress} />
        </div>
      );
    }
    return (
      <div className="center-content">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Symbol</th>
              <th scope="col">Logo</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Market Cap</th>
              <th scope="col">Circulating Supply</th>
              <th scope="col">24h Change</th>
            </tr>
          </thead>
          <tbody>{Coins}</tbody>
        </table>
        <div />
      </div>
    );
  }
}
export default App;
