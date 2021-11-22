const express = require('express');
const UserModel = require('../model/usermodel.js');
const ChatModel = require('../model/chatmodel.js');
const MessageModel = require('../model/messagemodel.js');
const router = express.Router();
const {param,validationResult} = require('express-validator')

//Get all discussions
router.get('/', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const chats = await ChatModel.find({user: req.user._id})
    res.send(chats)
    console.log('this is yours chats')
})

//Create a discussion
router.post('/newchat', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const user = await UserModel.findOne({_id: req.user._id})
    try {
        let chat = new ChatModel(req.body);
        chat.members.push(user._id);
        
        await chat.save();
        res.status(201).send(chat);
        console.log('discussion créée')
  }catch(err){
        res.status(400).send(err)
  }
})

//Add Members
router.put('/:id/addmember',
    param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId(),
    async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    
    const newmember = await UserModel.findOne({_id: req.body.userid})
    if(!newmember){
        return res.status(404).send({message:'user not found'})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message:'chat not found'})
    }
    try {
        chat.members.push({
            user:newmember,
            lastSeenAt: chat.createdAt
            });
        //chat.members.lastSeenAt = chat.createdAt
        await chat.save();
        res.status(201).send(chat);
        console.log('membre ajouté')
    } catch (err) {
        res.status(404).send(err)
    }
})

//LastSeenAt

//Delete User

router.delete('/:id/deletemember',
    param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId(),
    async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const outmember = await UserModel.findOne({_id: req.body.userid})
    if(!outmember){
        return res.status(404).send({message:'user not found'})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message:'chat not found'})
    }
    try {
        for( var i = 0; i < chat.members.length; i++){ 
        
        if ( chat.members[i]._id.toString() === outmember._id.toString()) { 
            chat.members.splice(i, 1); 
            i--; 
        }}
        
        await chat.save();
        res.status(201).send(chat);
        
        console.log(' membre supprimé')
    } catch (err) {
        res.status(404).send(err)
    }
})


module.exports = router;