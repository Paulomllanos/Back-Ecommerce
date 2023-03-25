const Product = require('../models/Product');
const User = require('../models/User');

const createProduct = async(req, res) => {
    try {
        const user = await User.findById(req.auth.id)
        console.log(user.isAdmin)
        if(!user.isAdmin){
            throw new Error('No tienes acceso para crear productos!')
        }

        const newProduct = new Product(req.body);
        await newProduct.save();
        
        res.json({success: true, message: "Se ha creado un nuevo producto", productId: newProduct._id, newProduct})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()

        res.json({succes: true, info: products})

    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error obteniendo los datos" })
    }
}

const getProductById = async (req, res) => {

    const { productId } = req.params;

    try {
        
        const product = await Product.findById(productId);

        res.json({ success: true, info: product})

    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error obteniendo los datos" })
    }
}

const editProduct = async (req, res) => {

    const { name, price, brand, image, stock } = req.body;
    const { productId } = req.params;
    try {
        const edit = await Product.findByIdAndUpdate(productId, { name, price, brand, image, stock }, { new: true })

        res.json({succes: true, msg: "Producto actualizado", update: edit})

    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error al actualizar el producto" })
    }
}

const deleteProduct = async (req, res) => {

    
    const { productId } = req.params;
    try {
        const product = await Product.findByIdAndDelete(productId)

        res.json({succes: true, msg: "Producto eliminado", delete: product})

    } catch (error) {
        res.status(500).json({ success: false, msg: "Hubo un error al eliminar el producto" })
    }
}

const reduceStock = async (req, res) => {
    const purshasedProducts = req.body.cartItems
    try {
        purshasedProducts.map(async(purshasedProduct) => {
        await Product.findByIdAndUpdate(purshasedProduct._id, { stock: purshasedProduct.stock - purshasedProduct.quantity })
      })
      res.json({ success: true, msg: 'stock reduced' })
    } catch(error) {
      res.json({ success: false, error: error.message })
    }
  }

module.exports = {createProduct, getProducts, getProductById, editProduct, deleteProduct, reduceStock}