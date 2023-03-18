
const User = require('../models/User');


const createUser = async(req, res) => {
    try {
        //* verificar email en uso
        const user = await User.findOne({ email: req.body.email })
        if(user){
            throw new Error('Email in use!!')
        } 

        //* Guardar info en nuestra base de datos
        const newUser = new User(req.body);
        newUser.hashPassword(req.body.password)

        await newUser.save() //* guarda en mongo atlas

        
        res.json({success: true, message: "User created successfully!", id: newUser._id, token: newUser.generateToken()}) 

    } catch (error) {
        res.json({ success: false, message: error.message })
    }  
}

const getUsers = async(req, res) => {
    try {
        const users = await User.find().populate('favoriteProducts');
        res.json({ success: true, users })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }   
}

const deleteUser = async(req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if(!result){
            throw new Error("Usuario no existe, imposible de eliminar!")
        }

        res.json({success: true, message: "Usuario Eliminado!!!"})


    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const editUser = async(req, res) => {

    const updateUser = req.body;
    const { id } = req.auth;
    console.log(id)
    try {

        //* creamos esta busqueda para validar que no exista el correo a editar o no sea el mismo

        const emails = await User.find()
       
        emails.forEach(user =>{
            if(user.email === req.body.email){
        
                    throw new Error("Email en uso")
                }
            }
        )
            
        const result = await User.findByIdAndUpdate(req.auth.id, updateUser, {new: true}).select("-password -salt");
 
        if(!result){
            throw new Error("Usuario no existe, imposible de editar!")
        }

        res.json({success: true, message: "Usuario editado con exito!!", info: result})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const getUserVerify = async(req, res) => {
    try {
        
        const { id } = req.auth
        
        const result = await User.findById(id).populate('favoriteProducts').select("-password -salt");

        res.json({success: true, message: `Informacion de: ${result.email}`, info: result})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email })

        if(!user){
            throw new Error('User not register!!')
        }

        const validate = user.hashValidation(password, user.salt, user.password)

        if(!validate){
            throw new Error('Email o contraseña incorrecta!')
        }
       
        res.json({success: true, message: "Your account is login", token: user.generateToken()})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


module.exports = { createUser, getUsers, deleteUser, editUser, signIn, getUserVerify }