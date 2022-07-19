var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stateSchema = new Schema({
    name: String,
    population: Number,
    area: String,
    country: [{type: Schema.Types.ObjectId, ref: 'Country'}],
    neighbouring_states: [{type: Schema.Type.ObjectId, ref: 'State'}]
}, {timestamps});

module.exports = mongoose.model('State', stateSchema);