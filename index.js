const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const key = require('./key.js');
const io = require('socket.io')(http);

var teams = [];

function awardPoints(teamName, index, points, res) {
  //If their team exists
  if (singleTeam = teams.find(t => t.name === teamName)) {

    //and they haven't already solved the problem
    if (~singleTeam.solved.indexOf(index)) return res.json({ message: 'You\'ve already got points for this!' });
    
    //Add points and push solved
    singleTeam.points += points;
    singleTeam.solved.push(index);

    io.emit('update', teams);

    return res.json({ message: 'Nice! Correct Answer!'})
  }
  return res.json({ error: 'There\'s no team by that name! Make sure you register first!'})
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/', express.static('build'));


//Validation checks
app.post('*', (req,res,next) => {
  const { team, answer } = req.body;

  //If they didn't include a team
  if (!team) return res.json({ error: 'You didn\'t include your team name!'})

  //If there's no team with that name
  var findTeam = teams.findIndex(t => t.name === team);
  if (!~findTeam && req.url !== '/register') return res.json({ error: 'There\'s no team by that name! Make sure you register first!'})

  //If it's /start and the team already exists
  if (req.url === '/register' && ~findTeam) return res.json({ error: 'That team name has already been chosen!' })
  
  //If they didn't include an answer
  if (!answer && (req.url !== '/register' && req.url !== '/94030nf')) return res.json({ error: 'You didn\'t include your answer!'})
  next();
})

//Main pages
app.get('/', (req,res) => res.render('index', {teams: teams}));
app.get('/board', (req,res) => res.json(teams));
app.get('/register', (req,res) => res.json({ message: 'POST your team name to /register' }));

//Register
app.post('/register', (req,res) => {
  teams.push({name: req.body.team, points: 0, solved: [] });
  io.emit('update', teams);
  res.json({ message: `Welcome, ${(req.body.team).toUpperCase()}! Get started making a GET request to /1`});
});

//Custom GET routes
app.get('/404', (req,res) => res.json({ message: 'Nothing is here. But thanks for checking!' }));
app.get('/roulette', (req,res) => (req.query.name ? awardPoints(req.query.name, '4', 1, res) : res.json({ message: `Looks like your missing something in your request!`})));
app.post('/94030nf', (req,res) => awardPoints(req.body.team, '3', 1, res));

//Make sure any other request is between 1 and 30
app.all('/:n', (req,res,next) => {
  if (req.params.n <= 30 && req.params.n >= 1) next();
  else return res.json({ error: 'Choose a number between 1 and 30!' });
});

//Other Routes
app.get('/:n', (req,res) => res.json({ message: key[req.params.n - 1].message }));
app.post('/:n', (req,res) => {
  const { answer, points, id, include } = key[req.params.n - 1];

  if (req.body.answer == answer || (!!include && String(req.body.answer).includes(answer))) awardPoints(req.body.team, req.params.n, points, res)
  else res.json({ message: `Nope, wrong answer!`})
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
