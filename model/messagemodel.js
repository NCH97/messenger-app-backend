const mongoose = require('./mongoose.js')

messageSchema = new mongoose.Schema({
    message : String,
    message_details : [
                {
                    delivered : Boolean,
                    read : Boolean
                }
            ],
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }

},{timestamps: true})

const MessageModel =  mongoose.model('message', messageSchema);
module.exports = MessageModel;