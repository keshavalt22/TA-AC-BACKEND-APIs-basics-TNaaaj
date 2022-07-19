var express = require('express');
var router = express.Router();
var Country = require('../models/country');
var state = require('../models/state');

router.get('/api', (req, res, next) => {
    Country.find({}, (err, countries) => {
        if(err) return next(err);
        res.status(200).json({countries});
    })
});

router.post('/api', (req, res, next) => {
    var data = req.body;
    data.ethnicity = data.ethnicity.trim().split(',');
    Country.create(data, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

router.post('/:id/api', (req, res, next) => {
    var id = req.params.id;
    var data = req.body;
    data.ethnicity = data.ethnicity.trim().split(',');
    data.neighbouring_countries = data.neighbouring_countries.trim().split(',');
    Country.findByIdAndUpdate(id, data, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

router.get('/api/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Country.findByIdAndDelete(id, (err, country) => {
        if(err) return next(err);
        State.deleteMany({stateId: state._id}, (err, info) => {
            if(err) return next(err);
            res.status(200).json({country});
        })
    })
})


router.post('/addNeighbourCountry/:id', (req, res, next) => {
    var countryId = req.params.id;
    var name = req.body.name;
    Country.findOne({name}, (err, country) => {
        if(err) return next(err);
        Coutry.findByIdAndUpdate(
            countryId, 
            {$push: {neighbouring_countries: country._id}},
            (err, updatedCountry) => {
                if(err) return next(err);
                res.status(200).json({updatedCountry});
            }
        )
    })
});

router.get('/allNeighbouringCountries/:id', (req, res, next) => {
    var id = req.params.id;
    Country.findById(id, (err, country) => {
        if(err) return next(err);
        res.status(200).json({neighboures: country.neighbouring_countries});
    })
})


router.get('/allReligions/:id', (req, res, next) => {
    var id = req.params.id;
    Country.findById(id, (err, country) => {
        if(err) return next(err);
        res.status(200).json({religions: country.ethnicity});
    })
})


router.get('/filter/religion', (req, res, next) => {
    var {religion} = req.body;
    Country.find({ethinicity: {$in: ['religion']}}, (err, countries) => {
        if(err) return next(err);
        res.status(200).json({countries});
    })
});

router.get('/filter/continent', (req, res, next) => {
    var{continent} = req.body;
    Country.find({continent: continent}, (err, contries) => {
        if(err) return next(err);
        res.status(200).json({contries});
    })
})

router.get('/filter/population', (req, res, next) => {
    var { minPopulation,  maxPopulation} = req.body;
    Country.find({population: 
        {$gte: minPopulation, $lte: maxPopulation}}, 
        (err, countries) => {
            if(err) return next(err);
            res.status(200).json({countries});
    })
})

router.post(':id', (req, res, next) => {
    var data = req.body;
    var countryId = req.params.id;
    State.create(data, (err, state) => {
        if(err) return next(err);
        Country.findByIdAndUpdate(
            countryId, 
            {$push: {states: state._id}},
            (err, country) => {
                res.status(200).json({state});
            })
    })
})

module.exports = router;