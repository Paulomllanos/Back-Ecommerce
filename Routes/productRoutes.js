const express = require('express');
const {createProduct, getProducts, getProductById, editProduct, deleteProduct} = require('../controllers/product.controller')
const auth = require('../Middlewares/auth')

const productRouter = express.Router();

productRouter.route('/products')
    .post(auth, createProduct)
    .get(getProducts)

//* Obtener un unico producto respecto a su id

productRouter.route('/products/:productId')
    .get(getProductById)
    .put(editProduct)
    .delete(deleteProduct)

module.exports = productRouter
