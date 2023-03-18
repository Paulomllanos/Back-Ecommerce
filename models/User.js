const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        default: "Nombre no señalado",
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: true,
        default: "Apellido no señalado",
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        required: true
    },
    age: {
        type: Number,
        min: 16,
        max: 90
    },
    newsletter: {
        type: Boolean,
    },
    favoriteProducts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'product' 
        }
    ],
    password: {
        type: String,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/gm],
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})
//* encriptar contraseña
userSchema.methods.hashPassword = function(password){
    this.salt = crypto.randomBytes(10).toString('hex')
    this.password = crypto.pbkdf2Sync(password, this.salt, 5000, 20, 'sha512').toString('hex')
}
//* validar contraseñas
userSchema.methods.hashValidation = function(password, salt, passwordDB) {
    const hash = crypto.pbkdf2Sync(password, salt, 5000, 20, 'sha512').toString('hex');
    return hash === passwordDB;
}

userSchema.methods.generateToken = function() {

    const payload = {
        id: this._id,
        firstname: this.firstname,
        email: this.email
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 360000 });
    return token;
}


const User = mongoose.model('user', userSchema);

module.exports = User;
