import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { message: '',
                   summonername: '', 
                   accountid: '0' }
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
 
  async getAccountId() {

    const response = await fetch('/api/hi/?summonername=' + this.state.summonername);
    const json = await response.json();
    this.setState({accountid: json});
/*
    fetch('/api/hi')
     .then(response=>response.json())
     .then(json=> this.setState({ accountid: json}))*/
  }

  async componentDidMount() {

    const response = await fetch('/api/message');
    const json = await response.json();
    this.setState({message: json});

/*
    fetch('/api/message')
      .then(response => response.json())
      .then(json => this.setState({ message: json }))*/

    this.setState({ summonername: this.getParameterByName('summonername')}, this.getAccountId);
   

  }

  async asyncData () {


    
 

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
        <h4>{this.state.summonername}{this.state.accountid}</h4>
        </div>
      </div>



    );
  }



}



export default App;
