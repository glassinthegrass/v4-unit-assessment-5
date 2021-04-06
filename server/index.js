require('dotenv').config();
const express = require('express'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts')
const app = express();
const cors = require('cors')
const massive = require('massive')
const session = require('express-session')
const middleware = require('./middleware')

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET}= process.env;

app.use(cors())
app.use(express.json());

app.use(
    session({
        resave:false,
        secret:SESSION_SECRET,
        saveUninitialized:true,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 14,
        }
    })
)
//Auth Endpoints
app.post('/api/auth/register', middleware.checkUsername, userCtrl.register);
app.post('/api/auth/login', middleware.checkUsername, userCtrl.login);
app.get('/api/auth/me', middleware.checkUsername, userCtrl.getUser);
app.post('/api/auth/logout', middleware.checkUsername, userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized:false
    }
})
.then(dbInstance => {
    app.set('db', dbInstance)
    app.listen(SERVER_PORT,()=> console.log(`you down in the ${SERVER_PORT} now boy`))
})
.catch(err => console.log(err));