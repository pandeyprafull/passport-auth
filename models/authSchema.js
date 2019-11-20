const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    name: { type: String, required: true},
    googleId: { type: String, required: true},
    Status: {type: Boolean, default: true, required: true}

});

const mainModel = mongoose.model('auths', model);

module.exports = mainModel;