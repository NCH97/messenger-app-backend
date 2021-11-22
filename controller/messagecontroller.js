const express = require('express');
const UserModel = require('../model/usermodel.js');
const ChatModel = require('../model/chatmodel.js');
const MessageModel = require('../model/messagemodel.js');
const {param,validationResult} = require('express-validator')
const router = express.Router();
const math = require('mathjs');

//Display messages
router.get('/:id/messages',
    param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId(), 
    async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message:'chat not found'})
    }
    var limit = 10;
    let totalMessage = await MessageModel.find(chat._id).count();
    let skip = totalMessage-limit;
    let currentPage = (Math.ceil(totalMessage/limit))
    
    await chat.save()
    
    const messages = await MessageModel.find(chat._id).skip(skip).limit(limit)
    
    res.send(messages)
    console.log('this is yours messages')
})

//Send message
router.post('/:id/sendmessage',
    param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId(), 
    async (req, res) => {
    
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message:'chat not found'})
    }
    try {
        let message = new MessageModel(req.body)
        message.sender = req.user._id
        message.chat = req.params.id
        message = await message.save()
        console.log(message.createdAt)
        chat.lastMessageSentAt = message.createdAt
        await chat.save()
        res.status(201).send(message);
        console.log('message envoyé')
  }catch(err){
        res.status(400).send(err)
  }
})

//lastSeenMessages
router.post('/lastSeenMessage',
    async (req, res) => {
    
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message:'chat not found'})
    }
    try {
        chat.members.lastSeenAt = Date.now();
  }catch(err){
        res.status(400).send(err)
  }
})

module.exports = router;