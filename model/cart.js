const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');


const Schema = mongoose.Schema;

const schema = new Schema({
    userId:{
        ref: 'user',
        type: Schema.Types.ObjectId,
        validate: {
            validator: async function(value) {
               const id = await mongoose.model('user').findById(value);
               return !!id;
            },
            message: 'user does not exist.'
         },
        required: true
    },
    title:{
        type: String
    },
    subtitle:{
        type: String
    },
    publisher:{
        type: String
    },
    publishedDate:{
        type: String
    },
    description:{
        type: String
    },
    authors:{
        type: [String]
    },
    pageCount:{
        type: Number
    },
    imageLinks:{
        smallThumbnail:{
            type:String
        },
        thumbnail:{
            type:String
        }
    },
    listPrice:{
        amount:{
            type:Number
        },
        currencyCode:{
            type:String
        }
    },
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
// schema.plugin(idValidator);
const cart = mongoose.model('cart',schema);
module.exports = cart;