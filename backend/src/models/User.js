const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String
},{
    timestamps: true //Esto hará a que se cree 2 campos de email y password
});

module.exports = model('User', userSchema);