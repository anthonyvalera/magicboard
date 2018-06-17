import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

const socket = io();

class Team extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    details: false
  };

  showDetails = () => this.setState({ details: !this.state.details });

  render() {
    const { name, points, solved } = this.props.team;

    return (
      <div className="card" onClick={this.showDetails}>
        <h2>{ name }</h2>
        {
          this.state.details
            ? <p>{ solved.sort((a,b) => parseInt(a) - parseInt(b)).map(i => <span>{i}</span>) }</p>
            : <p>{ points } Point{!points && 's'}</p>
        }
      </div>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
    socket.on('update', teams => this.setState({ teams }));
  }

  state = {
    teams: null
  };

  componentDidMount() {
    axios.get('/board').then(r => this.setState({ teams: r.data }));
  }

  render() {
    return (
      <section id="main">
        <h1>Leaderboard</h1>
        <p>Start at /register</p>
        <section>
          {this.state.teams &&
            this.state.teams.map(team => <Team key={team.name} team={team} />)}
        </section>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
