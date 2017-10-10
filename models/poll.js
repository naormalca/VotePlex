var mongoose = require("mongoose");
var pollSchema = new mongoose.Schema({
   title: String,
   maker :{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      fullname: String
   },
   options:[{name: String,vote:{type:Number,default:0}}],
   anonmyUser:[String] //list of anonymously user that vote.
});
module.exports = mongoose.model("Poll",pollSchema);

