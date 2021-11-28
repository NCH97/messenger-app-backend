const express = require('express');
const app = express();
const UserController = require('./controller/usercontroller.js')
const bodyParser = require('body-parser')
const AuthController = require('./controller/authcontroller.js')
const ChatController = require('./controller/chatcontroller.js')
const MessageController = require('./controller/messagecontroller.js')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require("jsonwebtoken");
const {secret} = require('./config')
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-node-fs-backend');
require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;

//i18n config for translate
i18next.use(Backend).use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json'
    }
  })

app.use(i18nextMiddleware.handle(i18next));

app.use(bodyParser.json())

app.use(cookieParser())

app.use((req,res,next) =>{
  if(!req.cookies.jwt){
    return next()
  }

  req.user = jsonwebtoken.verify(req.cookies.jwt, secret)
  return next()
})

app.use('/api/chats', ChatController)

app.use('/api/chatroom', MessageController)

app.use('/api/users', UserController)

app.use('/api/auth', AuthController)

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})