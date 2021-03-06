const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const key = require('./key.js');
const numberOfQuestions = key.length;

var teams = [];

const checkAnswer = (givenAnswer, correctAnswer) => givenAnswer == correctAnswer || String(givenAnswer).toLowerCase().includes(correctAnswer);
const awardPoints = (teamName, index, points, res) => {
  //If their team exists
  if (singleTeam = teams.find(t => t.name == teamName)) {

    //and they haven't already solved the problem
    if (~singleTeam.solved.indexOf(index)) return res.json({ message: 'You\'ve already got points for this!' });
    
    //Add points and push solved
    singleTeam.points += points;
    singleTeam.solved.push(index);

    teams.sort((a,b) => a.points <= b.points ? 1 : -1);
    io.emit('update', teams);

    return res.json({ message: 'Nice! Correct Answer!'})
  }
  return res.json({ error: 'There\'s no team by that name! Make sure you register first!'})
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});
app.use(bodyParser.json());
app.use('/', express.static('build'));
app.use('/', express.static('public'));


//Validation checks
app.post('*', (req,res,next) => {
  const { team, answer } = req.body;

  //If they didn't include a team
  if (!team) return res.json({ error: 'You didn\'t include your team name!'})

  //If there's no team with that name
  const findTeam = teams.findIndex(t => t.name === team);
  if (!~findTeam && req.url !== '/register') return res.json({ error: 'There\'s no team by that name! Make sure you register first!'})

  //If it's /start and the team already exists
  if (req.url === '/register' && ~findTeam) return res.json({ error: 'That team name has already been chosen!' })
  
  //If they didn't include an answer
  if (!answer && (req.url !== '/register' && req.url !== '/origin')) return res.json({ error: 'You didn\'t include your answer!'})
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

//Custom routes
app.get('/404', (req,res) => res.json({ message: 'Nothing is here. But thanks for checking!' }));
app.get('/giveuspoints', (req,res) => (req.query.team ? awardPoints(req.query.team, '4', 1, res) : res.json({ message: `Looks like your missing "?team=" in your request!`})));
app.put('/origin', (req,res) => awardPoints(req.body.team, '3', 1, res));

//Deleting teams
app.delete('/team', (req,res,next) => {
  const newTeams = teams.filter(t => t.name != req.body.name);
  teams = newTeams;
  io.emit('update', teams);
  return res.send('Team deleted');
});

//Make sure any other request is between 1 and length of key
app.all('/:n', (req,res,next) => {
  if (req.params.n <= key.length && req.params.n >= 1) next();
  else return res.json({ error: `Choose a number between 1 and ${key.length}!` });
});

//Other Routes
app.get('/:n', (req,res) => res.json({ message: key[req.params.n - 1].message }));
app.post('/:n', (req,res) => {
  const { answer, points } = key[req.params.n - 1];
  
  if (Array.isArray(answer) && answer.some(a => checkAnswer(req.body.answer, a)))
    awardPoints(req.body.team, req.params.n, points, res);
  
  else if (checkAnswer(req.body.answer, answer))
    awardPoints(req.body.team, req.params.n, points, res);

  else
    res.json({ message: `Nope, wrong answer!` })
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => console.log(`Server is listening on ${PORT}`));