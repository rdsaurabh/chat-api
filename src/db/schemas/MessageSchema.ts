import mongoose  from "mongoose";

const messageSchema = new mongoose.Schema({
    messageText:{type: String,
      required: true},
    senderId:{type: String,
      required: true},
    receiverId:{type: String,
      required: true},
    status:{type: String,
      required: true},
    timestamp:{type: String,
      required: true}
})

export default mongoose.model('message',messageSchema);