const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// create
app.post('/insert', (req, res) => {
    const task = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewTask(task);

    result
        .then(data => res.json({data: data}))
        .catch(err => console.log(err));
});

// read
app.get('/getTaskFromList/:id', (req, res) => {

    const id = req.params.id;

    const db = dbService.getDbServiceInstance();

    const result =  db.getAllData(id);

    result.then(data => res.json({data: data}))
       .catch( err => console.log(err));
})

// update
app.patch('/update', (req, res) => {
    let id = req.body.id;
    let done = req.body.Done;

    const db = dbService.getDbServiceInstance();

    const result = db.updateTask(id, done);

    result
        .then(data => res.json({success : data}))
        .catch( err => console.log(err));

})

// delete
app.delete('/delete/:id', ((req, res) =>{
    const id = req.params.id;

    const db = dbService.getDbServiceInstance();

    const result =  db.deleteTask(id);

    result
        .then(data => res.json({ success: data}))
        .catch( err => console.log(err));

}))

app.listen(process.env.PORT, () => {
    console.log('App is running...');
})