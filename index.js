const express = require("express");
const app = express();

const mongojs = require("mongojs");
const db = mongojs("travel", ["records"]);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/api/records', (req, res) => {
    const options = req.query;
    const sort = options.sort || {};
    const filter = options.filter || {};
    const limit = 3;
    const page = parseInt(options.page) || 1;
    const skip = (page - 1) * limit;
    for (i in sort) {
        sort[i] = parseInt(sort[i]);
    }

    db.records.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit,function(err,data){
        if(err){
            return res.sendStatus(500);
        } else {
            return res.status(200).json({
                meta:{ skip,
                    limit,
                    sort,
                    filter,
                    page,
                    total : data.length 
                },
                data,
                links:{
                    self:req.originalUrl,
                }
            });
        }
    });

    
});

app.get("/test",(req,res) => {
    return  res.json(req.query);
});

app.listen(8000, () => {
    console.log(`Server started on 8000...`);
});