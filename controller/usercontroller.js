const express = require('express');
const UserModel = require('../model/usermodel.js');
const {param,validationResult} = require('express-validator')
const router = express.Router();
const SALT_WORK_FACTOR = 10

router.get('/', async (req, res) => {
  const users = await UserModel.find()
  res.send(users)
})

router.get('/me', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: 'unauthorized'})
    }
    const user = await UserModel.findOne({_id: req.user._id})
    if(!user){
        return res.status(404).send({message:'user not found'})
    }
    res.send({user: user})
})

router.get('/:id',
    param('id')
    .notEmpty()
    .withMessage('id is not required')
    .isMongoId(),
(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next()
}, 
    async (req, res) => {
    
    const user = await UserModel.findOne({_id: req.params.id})
    if(!user){
        res.status(404).send({message: 'user not found'})
    }
    res.send({user})
})

router.post('/', async (req, res) => {
  
  try {
      let user = new UserModel(req.body)
      user = await user.save()
      res.status(201).send(user)
  }
  catch(err){
      res.status(400).send(err)
  }
})

module.exports = router