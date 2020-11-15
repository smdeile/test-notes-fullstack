const {Schema, model} = require('mongoose');

const schema = new Schema ({
    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true
    },

    img: 
    { 
        data: Buffer, 
        contentType: String, 
        required: false
    } 
})


module.exports = model('Note', schema)

