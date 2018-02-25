var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var mongoose = require('mongoose');
var Post = require('./models/Post');
var User = require('./models/User')
var Comment = require('./models/Comment');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var cors = require('cors');
var { check, validationResult } = require('express-validator/check');
var app = express();

//serve static files like js, css

app.use('/static', express.static(__dirname + '/client/build/static'));


//mongoose.connect('mongodb://localhost:27017/reddit_mern_challenge');

//sdbhdgebhdi267
//vgchtdfytf2168WERT
mongoose.connect('mongodb://sdbhdgebhdi267:vgchtdfytf2168WERT@ds247078.mlab.com:47078/mern_reddit_challenge');
app.use(cors({ 
  origin: ['https://mern-reddit-app-challenge.herokuapp.com', 'http://localhost:3000'],
  methods: ['GET', 'HEAD', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(session({
  proxy: true,
  secure: true,
  resave: true,
  secret: 'qwertyuiop1234567890',
  saveUninitialized: true,
  cookie: { 
    maxAge: (60000 * 60),
    secure: true,
    httpOnly: false,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(bodyParser.json());


//REGISTER Validation/created user

app.post('/api/register', [
  check('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email  should be an email address')
    .not().isEmpty().withMessage('Email is required'),


  check('firstname')
    .not().isEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('Firstname should be at least 2 letters')
    .matches(/^([A-z]|\s)+$/).withMessage('Firstname cannot have numbers'),
  
  check('lastname')
    .not().isEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Lastname should be at least 2 letters')
    .matches(/^([A-z]|\s)+$/).withMessage('Lastname cannot have numbers'),

  check('password')
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),

  check("passwordConfirmation", "Password confirmation  is required or should be the same as password")
    .custom(function (value, { req }) {
      if (value !== req.body.password) {
        throw new Error("Password don't match");
      }
      return value;
    }),
  check('email').custom(value => {
    return User.findOne({ email: value })
      .then(function (user) {
        if (user) {
          throw new Error('This email is already in use');
        }
      })
    //return value;
  }),


], function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }
  
  User.create({
    
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    
  })
    .then(function (user) {
      
      return res.send({ status: 'success', message: 'User created in database' });

    })
    .catch(function (error) {
      return res.send({ status: 'error', message: 'Something went wrong' });
    });

});

//LogIn 
app.post('/api/login', function (req, res) {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
    password: req.body.password
  })

    .then(function (user) {
      if (!user) {
        let errors_value = {
          login: { msg: 'Wrong email or password' }
        }
        return res.send({ errors: errors_value })
      } else {
        
        req.session.user = user;
        
        return res.send({ message: 'You are signed in' });
      }
      console.log(user);

      res.send(user);
    })
    .catch(function (error) {
      console.log(error);

    })
})



app.get('/api/current_user', function (req, res) {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(function (user) {
        res.send({ 
          _id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          
        })
      })
  } else {
    res.send({ error: 'not logged in' })
  }
});




app.post('/api/post', [

  check('postMessage')
    .not().isEmpty().withMessage('Post field is required')

],
function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send({ errors: errors.mapped() });
  }

  Post.create({
    text: req.body.postMessage,
    user: req.body.userId
  })
    .then(function (post) {
      res.send(post);
    })
    .catch(function (error) {
      res.send({ status: 'error', message: 'Could not create post in database' });
    });
});




app.get('/api/posts', function (req, res) {
  Post.find({})
    .sort({ likes: 'desc' })
    .populate('user')
    .sort({ createdAt: 'desc' })
    
    .then(function (posts) {
      res.send(posts);
    })
    .catch(function (error) {
      res.send({ status: 'error', message: 'Cannot find posts' });
    })

});




///Log Out
app.get('/api/logout', function (req, res) {
  req.session.destroy();
  res.send({ message: 'session destroyed' })
});




//Like Button

app.put('/api/post/:id/like', function (req, res) {
  Post.find({})
    .sort({
      likes: 'desc'
    })

  Post.findById(req.params.id)

    .then(function (post) {
      post.likes = post.likes + 1
      post.save();
      res.send({ likes: post.likes })
    })
})

app.get('api/post/:id/like', function (req, res) {
  Post.find({ post: req.params.id })
})

//Getting one post  message in the DB

app.post('/api/post/:id/update', function (req, res) {
  Post.findById(req.params.id)
    .then(function (post) {
      post.text = req.body.text
      post.save()
        .then(function (post) {
          res.send(post);
        });
    });
});





app.get('/test', function(req, res){
  res.send('Yehey it works!!!');
})

app.get('*', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
})

app.listen(process.env.PORT || 8080);