const express = require('express');
const {createUser, getUsers, deleteUser, editUser, signIn, getUserVerify} = require('../controllers/user.controller');
const auth = require('../Middlewares/auth')
const userRouter = express.Router();


userRouter.route('/user')
    .post(createUser)
    .get(getUsers)
    
//* Puede optativa
userRouter.route('/user/:id')
    .delete(deleteUser)

userRouter.route('/user/signin')
    .post(signIn)

userRouter.route('/user/verify-user')
    .get(auth, getUserVerify)

userRouter.route('/user/edit-profile')
    .put(auth, editUser)

module.exports = userRouter;