const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: [String],
    subtag: [String],
});

module.exports = mongoose.model("TagCollection", tagSchema);