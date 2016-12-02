const exp = require('express');
const app = exp();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');

var db = pgp('postgres://silverRectangle@localhost:5432/bitcoin_users');


app.engine('html', mustacheExpress());
app.set('view engine','html');
app.set('views',__dirname + '/views');
app.use('/', exp.static(__dirname + '/public'));
app.use(methodOverride('_method')) //method override
app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(bodyParser.json()); //body parser

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log('alive on 3k, yo.');
});


app.get("/", function(req,res){
  var logged_in, email, fname, lname, follow_coin, id;

  if(req.session.user){
      logged_in = true;
      email = req.session.user.email;
      fname = req.session.user.fname;
      lname = req.session.user.lname;
      follow_coin = req.session.user.follow_coin;
      id = req.session.user.id;
  }

    var data = {
      "logged_in": logged_in,
      "email": email,
      "fname": fname,
      "lname": lname,
      "follow_coin": follow_coin,
      "id": id
    }

    res.render('home/index', data);
})

app.get("/signup", function(req, res){
  res.render('signup/signup')
});





// //show the view to make a new user.
// app.get('/create',function(req,res){
//   res.render('create')
// })

// //create a new user.
// app.post('/users',function(req, res){
//   user = req.body

//   db.none('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',
//     [user.name,user.email,user.password])

//   res.render('index')
// });

///////Sign Up Page//////////////

app.post('/signup', function(req, res){
  var data = req.body;
  bcrypt.hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users (fname, lname, email, password_digest,follow_coin) VALUES ($1, $2, $3, $4, $5)",
      [data.fname, data.lname, data.email, hash, data.follow_coin]
    ).then(function(){
      res.redirect('/login');
    })
  });
})

app.post('/signup', function(req, res){
  var data = req.body;
   db.one(
      "INSERT INTO coins (follow_coin) VALUES ($1)",
      [data.follow_coin]
    ).then(function(){
      res.redirect('/login');
    })
  });

app.get('/login',function(req,res){
  res.render('signup/login')
})

app.post('/login', function(req, res){
  var data = req.body;
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});

app.get('/dashboard/:id',function(req, res){
  db.one('SELECT * FROM users where ID = $1',[req.params.id])
  .then(function(data){
    var user = data
    res.render('home/dashboard',user);
  });
});


app.put('/dashboard/:id',function(req, res){
  user = req.body
  id = req.params.id

  db.none("UPDATE users SET fname=$1, lname=$2, email=$3, password_digest=$4 WHERE id=$5",
    [user.fname,user.lname,user.email,user.password_digest,id])

  res.redirect('/dashboard/'+id);
});

app.delete('/dashboard/:id',function(req, res){

  var id = req.params.id
  console.log(id,'id')
  db.none("DELETE FROM users WHERE id=$1", [req.params.id])
  .then(function(){
    res.redirect('/')
  })

});
