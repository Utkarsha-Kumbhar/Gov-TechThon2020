const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const web_request = require("request-promise");
var async = require('async');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const auth_url = 'http://localhost:8080/api/auth/signin'
const signup_url = 'http://localhost:8080/api/auth/signup'

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const { request } = require("http");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to our application." });
// });

// route our app
app.get('/', function(req, res) {
  res.render('index.ejs',{root:'.'});
});
app.use(express.static('index2.html'));
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

app.get('/signup', async function(req, res, next) {
  var aadharno = req.body.aadhar;
  var userid = req.body.userid;
  var pwd = req.body.passwd;
  options = {
    url: signup_url,
    method: 'POST',
    form: {username: userid, email: "dummy@test.com", password: pwd, roles: ["user"]}
  }
  var result = await web_request(options);
  console.log("------------------------");
  console.log(result);
  res.json({ message: "user dashboard" });
});