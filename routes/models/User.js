// model of creating new user

const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    // string, obligatory field and unique value
    email: { type: String, required: true, unique: true },
    // password cant unique, he may repeat
    password: { type: String, required: true }
    // each user can have massive with link, its main think of our application
    // indicate type and link for model of this value
    links: [{ type: Types.ObjectId, ref: 'Link' }]
})

// calling model "User", and indicating schema of work ('schema)
module.exports = model('User', schema)