const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
let idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const schema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    },
    picture:{
        type: String
    },
    isDeleted:{type:Boolean},
    createdAt:{type:Date},
    updatedAt:{type:Date}

},
{
    timestamps:{
        createdAt:'createdAt',
        updatedAt:'updatedAt'
    }
}
)

schema.pre("save", async function (next){
    this.isDeleted=false;
    if(this.password){
        this.password = await bcrypt.hash(this.password,8);
    }
    next();
});

schema.methods.isPasswordMatch = async function (password){
    return bcrypt.compare(password,this.password)
};

schema.method('toJSON', function () {
    const {
      _id, __v, ...object
    } = this.toObject({ virtuals: true });
    object.id = _id;
    delete object.password;
    return object;
});

schema.plugin(idValidator);
schema.plugin(uniqueValidator, { message: 'Error, expected {VALUE} to be unique.' });

const user = mongoose.model('user',schema);

module.exports = user;