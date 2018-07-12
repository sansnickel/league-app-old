import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = { message: '',
                   summonername: '', 
                   accountid: '',
                   matchlist: [], 
                   matches: []}
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
        console.log(this.state.matchlist.length);
  
        for (var i = 0; i < this.state.matchlist.length; i++) {
          const response = await fetch('/api/summoner/match/?accountid=' + this.state.accountid + '&matchid=' + this.state.matchlist[i]);
          const json = await response.json();
          var clone = this.state.matches.slice();
          clone[i] = json;
          this.setState({matches: clone});
        }        
        
  
 }


 async getMatchlist() {

      const response = await fetch('/api/summoner/matchlist/?accountid=' + this.state.accountid);
      const json = await response.json();
      this.setState({matchlist: json}, this.getMatches);
    

 }

 
  async getAccountId() {

    if (this.state.summonername !== '') {
      const response = await fetch('/api/summoner/info/?summonername=' + this.state.summonername);
      const json = await response.json();
      this.setState({ accountid: json }, this.getMatchlist);
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
          <label htmlFor="summonername">Enter Summoner Name: </label>
            <input id="summonername" name="summonername" type="text"/>        
          <button>Search</button>
        </form>
        <h4>{this.state.summonername}{this.state.accountid}</h4>
        <h3>{this.state.matchlist.length}</h3>
        
        <table className = 'table'>
          <thead>
            <tr>
              <th>Win</th>
              <th>Duration</th>
              <th>Spell1</th>
              <th>Spell2</th>
              <th>Champion</th>
              <th>KDA</th>
              <th>Level</th>
              <th>CS</th>
              <th>CSPM</th>

            </tr>
          </thead>
          <tbody>
          {this.state.matches.map(match => <tr className= {match.win === true ? 'table-primary' : 'table-danger'}>
                                            <td>{match.win + ''}</td>
                                            <td>{match.duration}</td>
                                            <td>{match.spells[0]}</td>
                                            <td>{match.spells[1]}</td>
                                            <td><img src={'http://ddragon.leagueoflegends.com/cdn/8.14.1/img/champion/' + (match.champion)}/></td>
                                            <td>{match.kda}</td>
                                            <td>{match.level}</td>
                                            <td>{match.cs}</td>
                                            <td>{match.cspm}</td>
                                           </tr>)}
         </tbody>
         </table>
   
       </div>
       </div>
    );
   
  
    
}



}



export default App;
