var mysql = require("mysql");
var inquirer = require("inquirer");

let roles;
let departments;
let managers;

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
  getRoles();
  getDepartments();
  getManagers();
});

// function which prompts the user for what action they should take
start = () => {
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

getRoles = () => {
  connection.query("SELECT id, title FROM role", function (err, res) {
    if (err) throw err;
    roles = res;
    // console.table("roles");
  });
};

getDepartments = () => {
  connection.query("SELECT id, name FROM department", function (err, res) {
    if (err) throw err;
    departments = res;
    // console.log("departments");
  });
};

getManagers = () => {
  connection.query(
    "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee",
    function (err, res) {
      if (err) throw err;
      managers = res;
      // console.table("managers");
    }
  );
};

// ADD FUNCTIONS
add = () => {
  inquirer
    .prompt([
      {
        name: "add",
        type: "list",
        message: "Select what you would like to add.",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"],
      },
    ])
    .then(function (answer) {
      if (answer.add === "DEPARTMENT") {
        console.log("Add a new: " + answer.add);
        addDepartment();
      } else if (answer.add === "ROLE") {
        console.log("Add a new: " + answer.add);
        addRole();
      } else if (answer.add === "EMPLOYEE") {
        console.log("Add a new: " + answer.add);
        addEmployee();
      } else {
        connection.end();
      }
    });
};

addDepartment = () => {
  console.log("add function");
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter department to add.",
      },
    ])
    .then(function (answer) {
      connection.query(
        `INSERT INTO department (name) VALUES ('${answer.department}')`,
        function (err, res) {
          if (err) throw err;
          console.log("Department: " + answer.department + " added.");
        }
      );
    });
};

addRole = () => {
  // console.log("departmentOptions[1].name");
  // console.log("departmentOptions[1].id");
  let departmentOptions = [];
  for (i = 0; i < departments.length; i++) {
    departmentOptions.push(Object(departments[i]));
  }

  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter role to add.",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter role salary.",
      },
      {
        name: "department_id",
        type: "list",
        message: "Enter department for role.",
        choices: departmentOptions,
      },
    ])
    .then(function (answer) {
      for (i = 0; i < departmentOptions.length; i++) {
        if (departmentOptions[i].name === answer.department_id) {
          department_id = departmentOptions[i].id;
        }
      }

      connection.query(
        `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`,
        function (err, res) {
          if (err) throw err;

          console.log("1 new role added: " + answer.title);
        }
      );
    });
};

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee first name.",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee last name.",
      },
      {
        name: "role_id",
        type: "input",
        message: "Enter employee role.",
      },
      {
        name: "manager_id",
        type: "input",
        message: "Enter employee's manager.",
      },
    ])
    .then(function (answer) {
      connection.query(
        `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department_id}')`,
        function (err, res) {
          if (err) throw err;
          console.log("1 new role added: " + answer.title);
        }
      );
    });
}

// VIEW FUNCTIONS

// UPDATE FUNCTIONS
