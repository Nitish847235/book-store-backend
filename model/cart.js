const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');


const Schema = mongoose.Schema;

const schema = new Schema({
    userId:{
        ref: 'user',
        type: Schema.Types.ObjectId
    },
    products:[
        {
            productId:{
                ref:'product',
                type:Schema.Types.ObjectId
            },
            quantity:{type:Number},
            cartItemCreatedAt:{type:Date}
        }
    ],
    isDeleted:{type:Boolean},
    createdAt:{type:Date},
    updatedAt:{type:Date},
},
{
    timestamps:{
        createdAt:'createdAt',
        updatedAt:'updatedAt',
        cartItemCreatedAt:'cartItemCreatedAt'
    }
}
);

schema.pre('save', async function (next){
    this.isDeleted=false;
    next();
})

schema.method('toJSON', function () {
    const {
      _id, __v, ...object
    } = this.toObject({ virtuals: true });
    object.id = _id;
    return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const cart = mongoose.model('cart',schema);
module.exports = cart;