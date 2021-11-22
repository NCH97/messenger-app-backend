const mongoose = require('./mongoose.js')

chatSchema = new mongoose.Schema({
    name: {
      type: String,
      default: '',
    },
    is_group_chat : { 
        type : Boolean,
        default : false 
    },

    members : [
        {
            user: {
                type : mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            lastSeenAt : {
                type : Date
            }
        }
        
    ],

    lastMessageSentAt : {
        type : Date
    }

},{ timestamps: true })


const ChatModel =  mongoose.model('chat', chatSchema);
module.exports = ChatModel;