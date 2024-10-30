const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    destinatario : {type : Schema.Types.ObjectId, ref: "User", required: true},
    remitente : {type : Schema.Types.ObjectId, ref: "User", required: true},
    mensaje: {type: String, required: true, trim: true},
    isRead: {type: Boolean, default: false}
  },
  {
    timestamps: true
  }
)

const Message = model("Message", messageSchema);

module.exports = Message;