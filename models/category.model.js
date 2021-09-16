const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name : {
    unique : true,
    type : String,
    required: 'Can\'t enter a document without Category name'
  },
 image: {
      type: mongoose.SchemaTypes.Url,
 },
 products : [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }]   
})


const Category = mongoose.model("Category", CategorySchema);

module.exports = { Category };


