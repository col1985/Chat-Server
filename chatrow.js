var mongoose = require("./node_modules/mongoose/");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function () {
	var ChatRow : new Schema ({
        id       : ObjectId,
        username : {type: String, default: 'Anon'},
        msg     : String,
    	address	 : String,
        created  : { type : Date, default : Date.now },
    });
    mongoose.model("ChatRow", ChatRow);
};



    
