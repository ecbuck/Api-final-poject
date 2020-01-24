const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const ObjectId = require("mongodb").ObjectId;

//TODO: add our data access layer file
const DAL = require('./dataAccessLayer');

DAL.Connect();

const port = 3000;
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

//ENDPOINT
app.get('/api/posts', async (req, res) => {
      const result = await DAL.Find();

      res.send(result);

});

app.get('./api/posts/:id', (req, res) =>{

});

app.post('/api/posts', async (req, res) => {
    const data = req.body;
    //TODO: validate request (required fields, min length, is number)

    // if validation fails , res.sendStatus(400).send('namefield is missing');


    //TODO: sanitize data 
    const payload = {
        title: data.title,
        body: data.body,
        author: data.author,
        publishDate: data.publishDate,
    };

    //TODO: insert into database
    await DAL.Insert(payload);

    //TODO: send back correct status codes and useful error messages 

    res.sendStatus(201);
});

//TODO: add a put/patch endpoint

app.delete("/api/posts/:id", async function(req, res) {
    const id = req.params.id;
    const post = {
      _id: ObjectId(id)
    };
  
    const result = await DAL.Remove(post);
    res.send();
  });


app.listen(port, () => {
    console.log('Server Started!');

    console.log(`MONGODB_CONNECTION_STRING: ${process.env.MONGODB_CONNECTION_STRING}`);
});

