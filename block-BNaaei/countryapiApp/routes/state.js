var express = require('express');
var router = express.Router();
var Country = require('../models/country');
var State = require('../models/state');


router.get('/:id', (req, res, next) => {
    Country.findById(id, (err, country) => {
        if(err) return next(err);
        State.find({country: country._id}, (err, state) => {
            if(err) return next(err);
            res.status(200).json({states});
        })
    })
})

router.post('/:id/updateState', (req, res, next) => {
    var data = req.body;
    var id = req.params.id;
    State.findByIdAndUpdate(id, data, (err, state) => {
        if(err) return next(err);
        res.status(200).json({state})
    })
})


router.get(':id/deleteState', (req, res, next) => {
    let id = req.params.id;
    State.findById(id, (err, state) => {
        if(err) return next(err);
        Country.findByIdAndUpdate(
            state.country, 
            {$pull: {neighbouring_states: id}}, 
            (err, country) => {
                if(err) return next(err);
                res.status(200).json({country});
            }
        )    
    })
})

module.exports = router;