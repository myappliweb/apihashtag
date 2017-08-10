var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  port = process.env.PORT || 3000,
  app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/apphashtags');
var router = express.Router();


/* API TAG POPULARITY */
var tagSchema = mongoose.Schema({
  name        :  String,
  media_count : { type: Number, default: 1},
  updated     : { type: Date, default: Date.now }
});
var Tag = mongoose.model('Tag', tagSchema);



router.route('/tags/')
    .get(function(req, res){
      Tag.find(function(err, tags){
        if(err){
          res.send(err);
        }
        res.send(tags);
      });
    })
    .post(function(req, res){
      var tag = new Tag();
      tag.name = req.body.name;
      tag.media_count = req.body.media_count;
      tag.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message : 'tag created'});
      })
    });

router.route('/tags/:tag_id')
  .get(function(req, res){
    Tag.findOne({_id: req.params.tag_id}, function(err, tag){
      if(err){
        res.send(err);
      }
      res.send(tag);
    });
  })
  .put(function(req, res){
    Tag.findOne({_id: req.params.tag_id}, function(err, tag){
      if(err){
        res.send(err);
      }
      tag.name = req.body.name;
      tag.media_count = req.body.media_count;
      tag.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message: 'tag update'});
      });
    });
  })
  .delete(function(req, res){
    Tag.remove({_id: req.params.tag_id}, function(err){
      if(err){
        res.send(err);
      }
      res.send({message: 'tag deleted'});
    });
  });
  router.route('/tags/search/:tag_id')
    .get(function(req, res){
      Tag.findOne({_id: req.params.tag_id}, function(err, tag){
        if(err){
          res.send(err);
        }
        res.send(tag);
      });
    })
/* END API TAG POPULARITY */





/* API CORRELATION */
var Mixed = mongoose.Schema.Types.Mixed;
var correlationSchema = mongoose.Schema({
  tag        :  String,
  correlations : Mixed,
  updated     : { type: Date, default: Date.now }
});
var Correlation = mongoose.model('Correlation', correlationSchema);

router.route('/correlations/')
    .get(function(req, res){
      Correlation.find(function(err, correlations){
        if(err){
          res.send(err);
        }
        res.send(correlations);
      });
    })
    .post(function(req, res){
      var correlation = new Correlation();
      correlation.tag = req.body.tag;
      correlation.correlations = req.body.correlations;
      correlation.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message : 'correlation created'});
      })
    });

router.route('/correlations/:correlation_id')
  .get(function(req, res){
    Correlation.findOne({_id: req.params.correlation_id}, function(err, correlation){
      if(err){
        res.send(err);
      }
      res.send(correlation);
    });
  })
  .put(function(req, res){
    Correlation.findOne({_id: req.params.correlation_id}, function(err, correlation){
      if(err){
        res.send(err);
      }
      correlation.name = req.body.name;
      correlation.correlations = req.body.correlations;
      correlation.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message: 'correlation update'});
      });
    });
  })
  .delete(function(req, res){
    Correlation.remove({_id: req.params.correlation_id}, function(err){
      if(err){
        res.send(err);
      }
      res.send({message: 'correlation deleted'});
    });
  });
  router.route('/correlations/search/:correlation_id')
    .get(function(req, res){
      Correlation.findOne({_id: req.params.correlation_id}, function(err, correlation){
        if(err){
          res.send(err);
        }
        res.send(correlation);
      });
    })
    /* END API CORRELATION */

app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

app.use('/apphashtags/api/', router);
app.listen(port, function(){
  console.log('listening on port ' + port);
});
