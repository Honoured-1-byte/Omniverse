require('dotenv').config();
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'delta_app'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let data =[];
// for(let i=0; i<100; i++){
//   data.push(getRandomUser());
// }


// connection.end();
//home route
app.get("/", (req, res) => {
  let q = ` select count(*) from users;`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]['count(*)'];
      res.render("home", { totalUsers: count });
    })
  } catch (err) {
    console.log('Error connecting to the database:', err);
    res.render("Error connecting to the database");
  };
});

//show route
app.get("/user", (req, res) => {
  let q = `select * from users;`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers", { users });
    });
  } catch (err) {
    console.log('Error connecting to the database:', err);
    res.render("Error connecting to the database");
  }
});

//edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from users where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit", { user });
    });
  } catch (err) {
    console.log('Error connecting to the database:', err);
    res.render("Error connecting to the database");
  }
});

// update route
app.patch("/user/:id", (req, res) => {
  res.send("Update user");

});

app.listen("8080", () => {
  console.log("Server is running on port 8080");
});
