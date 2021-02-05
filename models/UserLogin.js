const mongoose = require('mongoose');

const UserLoginSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    token : {
        type:String,
        require:true
    },
    refreshtoken : {
        type:String,
        require:true
    },
    created : {
        type:Date,
        default: Date.now
    },
    updated : {
        type:Date,
        default: null
    }
})

module.exports = mongoose.model('user_login',UserLoginSchema);