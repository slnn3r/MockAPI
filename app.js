// a new line!

const express = require('express');
const app = express();
const fs = require("fs");

const config = require( "./config/config" )

const bodyParser = require('body-parser');

const morgan = require('morgan');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//
var publicdir = __dirname + '/';

// allow to open json file in any directory, only handle GET Request
app.use(express.static(publicdir,{extensions:['json']}));

app.use(function (req, res, next) {
    next();
});

// when input a URL but not JSON file in directory
// will output error msg
app.get('*',function (req, res, next) {

  res.status(404);
  res.json({
      error: {
          code: 404 + " - NO JSON FILE FOUND"
      }
  });

  next();
});


// will come to here if Request is not GET
app.post('/api',function (req, res, next) {

  // define the POST input value (what value to read)
  const user = {
    userid: req.body.userid,
  };

  var checkJSONFile = config[user.userid];

  if(checkJSONFile){
    var contents = fs.readFileSync(publicdir+config[user.userid]+".json");
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);

  }else{
    res.status(404);
    res.json({
      error: {
        code: 404  + " - Invalid USERID"
      }
    });
  }

  next();

});

app.post('/plus',function (req, res, next) {

  // define the POST input value (what value to read)
  const user = {
    icno: req.body.icno,
  };

  var checkJSONFile = config[user.icno];

  if(checkJSONFile){
    var contents = fs.readFileSync(publicdir+config[user.icno]+".json");
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);

  }else{
    res.status(404);
    res.json({
      error: {
        code: 404  + " - Invalid ICNO"
      }
    });
  }


});


module.exports=app;
