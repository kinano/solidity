import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // ECMA 2016
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount() {
    // We assume the user is running metamask on the browser and we don't need to define their eth account
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    // The balance is fetched from web3 directly for the lottery account
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({
      manager,
      players,
      balance
    })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: 'Submitting the lottery entry'
    })
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({
      message: 'You have been entered to the lottery'
    })
  };

  pickWinnerHandler = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: 'Picking the winner'
    });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({
      message: 'A winner has been picked'
    });
  };

  render() {

    return (
      <div className="App">
        <h2>
          Lottery Contract
        </h2>
        <p>
          This contract is managed by {this.state.manager}
          <br />
          There are currently {this.state.players.length} players
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />
        <form>
          <h4>Try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({
                value: event.target.value
              })}
            />
            <button onClick={this.onSubmit}>
              Enter
            </button>
          </div>
        </form>
        <hr />
          <h4>Pick the winner</h4>
          <button onClick={this.pickWinnerHandler}>
              Pick winner
          </button>
        <hr />
        <h1>
          {this.state.message}
        </h1>
      </div>
    );
  }
}

export default App;
