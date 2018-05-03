const express = require('express');
const app = express();
const fs = require("fs");

const conditionConfig = require( "./config/conditionConfig" )
const postConfig = require( "./config/postConfig" )
const inputConfig = require( "./config/inputConfig" )

const bodyParser = require('body-parser');

const morgan = require('morgan');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var publicdir = __dirname + '/';

// allow to open json file in any directory, only handle GET Request
app.use(express.static(publicdir,{extensions:['json']}));

app.use(function (req, res, next) {
    next();
});


app.get('*',function (req, res, next) {

  res.status(404);
  res.json({
      error: {
          code: 404 + " - NO JSON FILE FOUND"
      }
  });

  next();
});


app.post(postConfig.URL,function (req, res, next) {


  var input = req.body;

  var getItem;

  for(var propName in input) {
    if(input.hasOwnProperty(propName)) {
        var propValue = input[propName];

        console.log(propValue);
        getItem=propValue;

    }
  }

  //
  var checkJSONFile = conditionConfig[getItem];

  if(checkJSONFile){
    var contents = fs.readFileSync(publicdir+conditionConfig[getItem]+".json");
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);

  }else{
    res.status(404);
    res.json({
      error: {
        code: 404  + " - Invalid Input"
      }
    });
  }

  next();

});


module.exports=app;
