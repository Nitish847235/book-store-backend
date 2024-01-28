const Cart = require("../model/cart");
const cartSchemaKey = require('../utils/validation/cartValidation');
const validation = require('../utils/validateRequest');
const ObjectId = require('mongodb').ObjectId;

const create = async(req,res) => {
    try {
        let reqData = req.body || {};
        if(!reqData.userId){
            return res.badRequest({message : "Insufficient request parameters! userId is required"}) 
        }
        let validateRequest = validation.validateParamsWithJoi(
            reqData,
            cartSchemaKey.schemaKeys);
          if (!validateRequest.isValid) {
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
          }

        const check = {
            userId: reqData.userId,
            title:reqData?.title,
            publishedDate: reqData?.publishedDate,
            description: reqData?.description,
        }

        let cartCheck = await Cart.findOne(check)
        console.log("cartCheck",cartCheck);
        if(cartCheck){
            return res.badRequest({message : "Product already in Your Cart"})
        }

        let dataToCreate = new Cart(reqData);
        let createdData = await Cart.create(dataToCreate)
        
        return res.success({ data : createdData });

    } catch (error) {
        console.log("cart create", error);
        return res.internalServerError({ message: "Internal Server Error" });
    }
}

const findAllCart = async (req,res) => {
    try {
      let options = {};
      let query = {};

      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        cartSchemaKey.findFilterKeys,
        Cart.schema.obj
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }

      if (typeof req.body.query === 'object' && req.body.query !== null) {
        query = { ...req.body.query };
      }
      if (req.body.isCountOnly){
        let totalRecords = await Cart.countDocuments(query);
        return res.success({ data: { totalRecords } });
      }
      if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
        options = { ...req.body.options };
      }
      let foundCarts = await Cart.paginate(query,options);
      console.log(foundCarts);
      if (!foundCarts || !foundCarts.docs || !foundCarts.docs.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundCarts });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };
   
  const getCart = async (req,res) => {
      try {
        let query = {};
        if (!ObjectId.isValid(req.params.id)) {
            return res.validationError({ message : 'invalid objectId.' });
          }
        query._id = req.params.id;
        query.isDeleted = false
        let options = {};
        let foundCart = await Cart.findOne(query, options);
        if (!foundCart){
          return res.recordNotFound();
        }
        return res.success({ data :foundCart });
      }
      catch (error){
        return res.internalServerError({ message:error.message });
      }
    };
  
  const getCartCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        cartSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedCart = await Cart.count(where);
      return res.success({ data : { count: countedCart } });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

  const updateCart = async (req,res) => {
      try {
        let dataToUpdate = {
          ...req.body,
          updatedBy:req.user.id,
        };
        let validateRequest = validation.validateParamsWithJoi(
            dataToUpdate,
            cartSchemaKey.updateSchemaKeys
          );
          if (!validateRequest.isValid) {
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
          }
        const query = { _id:req.params.id };
        let updatedCart = await Cart.findOneAndUpdate(query,dataToUpdate);
        if (!updatedCart){
          return res.recordNotFound();
        }
        return res.success({ data :updatedCart });
      } catch (error){
        return res.internalServerError({ message:error.message });
      }
    };
  
  const softDeleteCart = async (req,res) => {
      try {
        if (!req.params.id){
          return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
        }
        let query = { _id:req.params.id };
        const updateBody = {
          isDeleted: true,
          updatedBy: req.user.id,
        };
        let updatedCart = await Cart.findOneAndUpdate(query, updateBody);
        if (!updatedCart){
          return res.recordNotFound();
        }
        return res.success({ data:updatedCart });
      } catch (error){
        return res.internalServerError({ message:error.message }); 
      }
    };

  const deleteCart = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedCart = await Cart.findOneAndDelete( query);
      if (!deletedCart){
        return res.recordNotFound();
      }
      return res.success({ data :deletedCart });
          
    }
    catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

  
  

module.exports = {
    create,
    findAllCart,
  getCart,
  getCartCount,
  updateCart,
  softDeleteCart,
  deleteCart,
}