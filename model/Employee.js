const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    }

    // We don't need to create an id field, Mongoose will do that for us!
});

module.exports = mongoose.model('Employee', employeeSchema);
// Mongoose automatically looks for the plural, lowercased version of your model name.
// in this example, will look for 'employees'.