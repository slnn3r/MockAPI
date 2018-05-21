const express = require('express');
const app = express();
const fs = require("fs");

const config = require( "./config/config")
const errorConfig = require( "./config/404")

const bodyParser = require('body-parser');

const morgan = require('morgan');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var publicdir = __dirname + '/';

app.use(express.static(publicdir,{extensions:['json']}));

app.use(function (req, res, next) {
    next();
});


app.get('*',function (req, res, next) {

  res.status(404);
  res.json(errorConfig);

});



for(var urlCount in config){

  app.post(config[urlCount].url,function (req, res, next) {

    for(var selectedUrlCount in config){

      if(req.route.path==config[selectedUrlCount].url){
        var valueLoop=0;


        if(config[selectedUrlCount].condition.length>0 && config[selectedUrlCount].request.length>0){

          for(var valueInput in config[selectedUrlCount].condition){////

            var valueCount = Object.keys(config[selectedUrlCount].condition).length;


            var allKeys = parseKeys([], req.body);
            var allItems = parseItems([], req.body);



            var inputCount = Object.keys(allKeys).length;
            var inputGo = 0;

            for(var go in allKeys){


              if(config[selectedUrlCount].request==allKeys[go]){


                if(config[selectedUrlCount].condition[valueInput].value==allItems[go]){

                  var contents = fs.readFileSync(publicdir+config[selectedUrlCount].condition[valueInput].path);
                  var jsonContent = JSON.parse(contents);

                  res.send(jsonContent);

                }else{

                  valueLoop+=1;
                  if(valueLoop>=valueCount){
                    return next();
                  }
                }

              }else{
                inputGo+=1;
                if(inputGo>=inputCount){
                  return next();

                }
              }

            }


          }////


        }else{

          if(config[selectedUrlCount].default){

            var contents = fs.readFileSync(publicdir+config[selectedUrlCount].default);
            var jsonContent = JSON.parse(contents);
            res.send(jsonContent);
          }else{
            next()
          }

        }




      }

    }


  });


}



app.use(function (req, res, next) {
  res.status(404);
  res.json(errorConfig);
});



function parseKeys(keys, obj) {
  return Object.keys(obj).reduce(function (keys, key) {
    if (typeof obj[key] !== 'object') {
      return keys.concat(key);
    }

    return parseKeys(keys, obj[key]);
  }, keys);
}


function parseItems(keys, obj) {
  return Object.keys(obj).reduce(function (keys, key) {
    if (typeof obj[key] !== 'object') {
      return keys.concat(obj[key]);
    }

    return parseItems(keys, obj[key]);
  }, keys);
}


module.exports=app;
