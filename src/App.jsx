import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import io from 'socket.io-client';
let socket = io();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: allTeams || null
    }

    socket.on('update', (teams) => {
      teams.sort((a,b) => a.points + b.points);
      this.setState({ teams })
    });
  }

  render() {
    return (
      <section id="main">
        <h1>Leaderboard</h1>
        <p>Start at /register</p>
        <section>
            {!!this.state.teams && this.state.teams.map((team, index) => {
              return (
                <div className="card" key={`${team.name}_${index}`}>
                  <h2>{team.name}</h2>
                  <p>{team.points} Point{ team.points !== 1 && 's'}</p>
                </div>
              )
            })}
        </section>
      </section>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
