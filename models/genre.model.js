const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;

const GenreSchema = new Schema({
  name : {
    unique : true,
    type : String,
    required: 'Can\'t enter a document without Genre name'
  },
 image: {
      type: mongoose.SchemaTypes.Url,
 },
 products : [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }]   
})


const Genre = mongoose.model("Genre", GenreSchema);

module.exports = { Genre };


