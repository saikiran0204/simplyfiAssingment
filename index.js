const express = require("express");
const app = express();
var port = 4000;
const userModel = require('./userModel')

const fileupload = require("express-fileupload");
app.use(fileupload())

app.post('/upload', async function (req, res, next) {
  try {
    if (req.files != null) {
      var string = new TextDecoder('utf8').decode(req.files.test.data);
      string = string.replace('\r', '')
      string = string.split('\n');
      var headers = string[0].split(',');
      for (var i = 1; i < string.length; i++) {
        record = {}
        if (string[i] !== '') {
          string[i].split(',').map((element, i) => {
            record[headers[i]] = element;
          })
          console.log(record);
          await userModel.create(record)
        }
      }

      return res.status(200).send({ "success": true, "message": "upload successfully" })
    }
    return res.status(400).send({ "success": false, "message": "File Not Found" });
  } catch (e) {
    return res.status(500).send({ "success": false, "message":"Something went wrong"});
  }
})

app.get('/students/:id/result', async function (req, res, next) {
  try {
    var record = await userModel.findOne({
      where: { Id: parseInt(req.params.id)}
    })
    if(!record) {
      return res.status(400).send({ "success": false, "message":"Record not found"});
    }
    return res.status(200).send({ "success": true, "data": record })
   } catch (e) {
    return res.status(500).send({ "success": false, "message":"Something went wrong"});
  }
})

app.get('/students', async function (req, res, next) {
  try { 
    if(req.query.resultStatus != 'passed/failed') {
      return res.status(400).send({ "success": false, "message":"Please send correct query params"});
    }
    var record = await userModel.findAll({attributes: ['Name', 'Mark1', 'Mark2', 'Mark3']});
    for (var i = 0; i < record.length; i++) {
      record[i].dataValues.average = ((record[i].Mark1 + record[i].Mark2 + record[i].Mark3) / 3).toFixed(2);
      record[i].dataValues.pass = "Fail"
      if(record[i].dataValues.average > 40) {
        record[i].dataValues.pass = "Pass"
      }
    }
    return res.status(200).send({ "success": true, "data": record })
  } catch (e) {
    return res.status(500).send({ "success": false, "message":"Something went wrong"});
  }
})



app.listen(port, () => console.log('Server is up and running on port : ' + port));