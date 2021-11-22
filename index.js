const express = require('express')
const app = express()
const port = 3000
const UserController = require('./controller/usercontroller.js')
const bodyParser = require('body-parser')
const AuthController = require('./controller/authcontroller.js')
const ChatController = require('./controller/chatcontroller.js')
const MessageController = require('./controller/messagecontroller.js')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require("jsonwebtoken");
const {secret} = require('./config')

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
  console.log(`Example app listening at http://localhost:${port}`)
})