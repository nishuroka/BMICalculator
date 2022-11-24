const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
const store = require("store2");
// app.use(bodyparser.urlencoded({extended:true}))

let db = new sqlite3.Database("./bmi.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the bmi database.");
  });

  const createTable = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS bmi (` +
          `id INTEGER PRIMARY KEY AUTOINCREMENT,` +
          `name TEXT,` +
          `weight INTEGER NOT NULL,` +
          `height INTEGER NOT NULL,` +
          `bmi INTEGER NOT NULL` +
          `);`,
        (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log("Created table");
        }
      );
  };


  const insertData = (name, weight, height, bmi) => {
    db.run(
      `INSERT INTO bmi (name, weight, height, bmi) VALUES (?, ?, ?, ?)`,
      [name, weight, height, bmi],
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Inserted data");
      }
    );
  };
  const getData = (callback) => {
    db.all(`SELECT * FROM bmi`, (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      callback(rows);
    });
  };

  createTable();
  
  app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/calcBMI.html")
    
})

app.get('/admin', (req, res)=>{
    res.sendFile(__dirname+"/admin.html")
    
})
app.get("/admin.html", (req, res) => {
    getData((rows) => {
      res.send({ rows: rows });
    });
  });

app.post('/calc', function(req,res){
    var name = req.body.name;
    var weight = req.body.weight;
    var height = req.body.height;
    var bmi = weight / (height*2);
    var ans =  bmi.toFixed(2);
    // console.log("body",req.body.name);
    insertData(name, weight, height, ans);
    
    res.send(JSON.stringify({ans:ans}));

    // store.set('Profile', {name: name, weight: weight, height: height, bmi:ans}); 


    
});


app.listen(3000, (res)=>{
    console.log("Server started")
});