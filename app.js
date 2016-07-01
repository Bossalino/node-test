const express = require('express');
const path = require('path');
const bodyParser= require('body-parser')
const github = require('octonode');

const app = express();
const client = github.client();

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('index', { title: 'Check who are following you on git hub' });
})

app.post('/', (req, res) => {
  var username = req.body['username'];
  var ghuser = client.user(username);

  ghuser.followers({}, (err, data, headers) => {
    if (!data)
      res.render('index', {
        title: 'Check who are following you on Github',
        user: username
      });
    else {
      var users = [];
      data.forEach((user) => {
        users.push({
          login: user['login'],
          avatar_url: user['avatar_url'],
          url: user['url']
        });
      });
      res.render('index', {
        title: 'These guy following ' + username,
        user: username,
        followers: users
      });
    }
  });
});



app.listen(3000)
