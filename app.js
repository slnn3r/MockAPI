const express = require('express');
const app = express();
const fs = require("fs");

const config = require( "./config/config" )

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

});



for(var urlCount in config){

  app.post(config[urlCount].url,function (req, res, next) {

    for(var selectedUrlCount in config){

      if(req.route.path==config[selectedUrlCount].url){
        var valueLoop=0; // define loop time

        for(var valueInput in config[selectedUrlCount].condition){

          var valueCount = Object.keys(config[selectedUrlCount].condition).length; // get how much value count

          console.log(valueCount);

          // get the Input Value
          var input = req.body;
          var getItem;
          for(var propName in input) {
            if(input.hasOwnProperty(propName)) {
                var propValue = input[propName];
                getItem=propValue;
            }
          }
          //
          var parseRequestBody =JSON.stringify(req.body);
          var getVar = parseRequestBody.substring(parseRequestBody.lastIndexOf("{")+2,parseRequestBody.lastIndexOf(":")-1);

          if(config[selectedUrlCount].request==getVar){

            if(config[selectedUrlCount].condition[valueInput].value==getItem){

              var contents = fs.readFileSync(publicdir+config[selectedUrlCount].condition[valueInput].path);
              var jsonContent = JSON.parse(contents);

              res.send(jsonContent);

            }else{

              valueLoop+=1;
              if(valueLoop>=valueCount){ // if loop times >= value count == no result found/matched, so break here.
                return next();
              }
            }

          }else{

            return next();

          }


        }

      }

    }


  });


}

app.use(function (req, res, next) {
  res.status(404);
  res.json({
      error: {
          code: 404 + " - Invalid POST Input"
      }
  });
});






module.exports=app;
