import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { message: '',
                   summonername: '', 
                   accountid: '0',
                   matches: '' }
    this.updateState = this.updateState.bind(this);
  };
  
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  updateState(e) {
    this.setState({ summonername: e.target.value })
  }

 async getMatches() {
    if (this.state.accountid !== '') {
      const response = await fetch('/api/summoner/matches/?accountid=' + this.state.accountid);
      const json = await response.json();
      this.setState({matches: json});
    }

 }

 
  async getAccountId() {

    if (this.state.summonername !== '') {
      const response = await fetch('/api/summoner/info/?summonername=' + this.state.summonername);
      const json = await response.json();
      this.setState({accountid: json}, this.getMatches);
    }

  }


  async componentDidMount() {

    const response = await fetch('/api/message');
    const json = await response.json();
    this.setState({message: json});

    if (this.getParameterByName('summonername') !== null) {
      this.setState({ summonername: this.getParameterByName('summonername')}, this.getAccountId);
    }
   

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.message}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
        <form onSubmit={this.updateState}>
          <label htmlFor="summonername">Enter Summoner Name</label>
            <input id="summonername" name="summonername" type="text"/>        
          <button>Search</button>
        </form>
        <h4>{this.state.summonername}{this.state.accountid}{this.state.matches}</h4>
        </div>
      </div>



    );
  }



}



export default App;
