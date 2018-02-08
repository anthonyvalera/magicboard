import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: allTeams
    }

    setInterval(this.poll, 10000);
  }

  poll = () => {
    axios.get('/board').then(r => this.setState({teams: r.data}));
  }

  render() {
    return (
      <section id="main">
        <h1>Leaderboard</h1>
        <p>Current standings</p>
        <section>
            {!!this.state.teams && this.state.teams.map(team => {
              return (
                <div key={team.name}>
                  <h2>{team.name}</h2>
                  <p>Points: {team.points} </p>
                </div>
              )
            })}
        </section>
      </section>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
