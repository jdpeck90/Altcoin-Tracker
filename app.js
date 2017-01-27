
/////////------SET UP VARIABLES------/////////
const exp = require('express');
const app = exp();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');

/////////------DATABASE------/////////
const pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL || 'postgres://silverRectangle@localhost:5432/bitcoin_users');


/////////-----MUSTACHE/METHOD OVERRIDE/BODY PARSER------/////////
app.engine('html', mustacheExpress());
app.set('view engine','html');
app.set('views',__dirname + '/views');
app.use('/', exp.static(__dirname + '/public'));
app.use(methodOverride('_method')) //method override
app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(bodyParser.json()); //body parser


/////////------INITIALIZE SESSION------/////////
app.use(session({
  secret: 'secretsession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

/////////------START PORT------/////////
const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log('alive on 3k, yo.');
});



/////////------GET POST PUT DELETER------/////////
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
    console.log(data,'log in data')
    res.render('home/index', data);
})

app.get("/logout/:id", function(req,res){
  var logged_in, id;

  if(req.session.user){
      logged_in = false;
      id = req.session.user.id;
  }

    var data = {
      "logged_in": logged_in,
      "id": id
    }

    res.render('home/index', data);
})

app.get("/signup", function(req, res){
  res.render('signup/signup')
});


app.post('/signup', function(req, res){
  var data = req.body;
  bcrypt.hash(data.password, 10, function(err, hash){
    db.one(
      "INSERT INTO users (fname, lname, email, password_digest, follow_coin) VALUES ($1, $2, $3, $4, $5); SELECT currval('users_id_seq')",
      [data.fname, data.lname, data.email, hash, data.follow_coin]
    ).then(function(qres){
       userId = qres.currval;
      var coins = data.follow_coin;
      var query = coins.map(function(coin){
        return(
          pgp.as.format("INSERT INTO coins (name, user_id) VALUES ($1, $2);",
            [coin, userId])
          );
      }).join('');
      db.none(query)
        .then(function(){
            res.redirect('/login');
        })
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
app.get("/alerts/:id", function(req,res){
    db.any('SELECT * FROM notifications WHERE user_id = $1',[req.params.id])
  .then(function(data){
    var userData = {
      notifications: data
    }
    console.log(userData,'userData')
    res.render('home/alerts',userData);
  });
})

app.post("/alerts/:id", function(req,res){
  var userID = req.session.user
  console.log(userID.id,'userID')
  var notifications = req.body
  console.log(notifications)
 db.none('INSERT INTO notifications (base, target, method, user_id) VALUES ($1, $2, $3, $4);',
  [notifications.base, notifications.target, notifications.method, userID.id])
        .then(function(){
            res.redirect('/');
        })
  })
