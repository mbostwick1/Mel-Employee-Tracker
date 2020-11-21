var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Barkley42",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Select what you would like to do.",
      choices: ["ADD", "VIEW", "UPDATE", "EXIT"],
    })
    .then(function (answer) {
      if (answer.action === "ADD") {
        // console.log("add selected");
        add();
      } else if (answer.action === "VIEW") {
        // view();
      } else if (answer.action === "UPDATE") {
        // update();
      } else {
        connection.end();
      }
    });

}

function add() {
  console.log("add function");
  afterConnection();
}


function afterConnection() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
}