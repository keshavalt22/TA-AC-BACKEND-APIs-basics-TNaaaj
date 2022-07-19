var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new Schema({
    name: String,
    continent: String,
    population: Number,
    ethinicity: [String],
    area: String,
    states: [{type: Schema.Types.ObjectId, ref: 'State'}],
    neighbouring_countires: [{type: Schema.Type.ObjectId, ref: 'Country'}]
}, {timestamps});

module.exports = mongoose.model('Country', countrySchema);