const express = require('express');
const UserModel = require('../model/usermodel.js');
const ChatModel = require('../model/chatmodel.js');
const MessageModel = require('../model/messagemodel.js');
const router = express.Router();
const {param,validationResult} = require('express-validator')

//Get all discussions
router.get('/', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: req.t('unauthorized')})
    }
    const chats = await ChatModel.find({user: req.user._id})
    res.send(chats)
    console.log('this is yours chats')
})

//Create a discussion
router.post('/newchat', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: req.t('unauthorized')})
    }
    const user = await UserModel.findOne({_id: req.user._id})
    try {
        let chat = new ChatModel(req.body);
        chat.members.push({
            user: user._id,
            lastSeenAt: chat.createdAt
            });
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
        return res.status(401).send({message: req.t('unauthorized')})
    }
    
    const newmember = await UserModel.findOne({_id: req.body.userid})
    if(!newmember){
        return res.status(404).send({message: req.t('user_not_found')})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message: req.t('chat_not_found')})
    }

    let userinchat = chat.members.find( ({ user }) => user.toString() === newmember._id.toString())
    if (userinchat === undefined){
        try {
            chat.members.push({
                user:newmember._id,
                lastSeenAt: chat.createdAt
                });
            
            await chat.save();
            res.status(201).send(chat);
            console.log('membre ajouté')
        } catch (err) {
            res.status(404).send(err)
        }
    }
    else{
        console.log("user already exist")
        return res.status(401).send({message: req.t('user_already_exist')})
    }

})


//Delete Member

router.delete('/:id/deletemember',
    param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId(),
    async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: req.t('unauthorized')})
    }
    const outmember = await UserModel.findOne({_id: req.body.userid})
    if(!outmember){
        return res.status(404).send({message: req.t('user_not_found')})
    }
    const chat = await ChatModel.findOne({_id:  req.params.id})
    if(!chat){
        return res.status(404).send({message: req.t('chat_not_found')})
    }
    try {
        for( var i = 0; i < chat.members.length; i++){ 
        
        if ( chat.members[i].user.toString() === outmember._id.toString()) { 
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