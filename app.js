var mysql = require("mysql");
var inquirer = require("inquirer");
const figlet = require("figlet");
const { printTable } = require("console-table-printer");

let roles;
let departments;
let managers;
let employees;

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

figlet("Employee Tracker", (err, result) => {
  console.log(err || result);
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  start();
  getRoles();
  getDepartments();
  getManagers();
  getEmployees();
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
        view();
      } else if (answer.action === "UPDATE") {
        update();
      } else if (answer.action === "EXIT") {
        connection.end();
      } else {
        connection.end();
      }
    });
};

getRoles = () => {
  connection.query("SELECT id, title FROM role", (err, res) => {
    if (err) throw err;
    roles = res;
  });
};

getDepartments = () => {
  connection.query("SELECT id, name FROM department", (err, res) => {
    if (err) throw err;
    departments = res;
  });
};

getManagers = () => {
  connection.query(
    "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee",
    (err, res) => {
      if (err) throw err;
      managers = res;
    }
  );
};

getEmployees = () => {
  connection.query(
    "SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee",
    (err, res) => {
      if (err) throw err;
      employees = res;
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
          getDepartments();
          start();
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

          // console.log("1 new role added: " + answer.title);
          getRoles();
          start();
        }
      );
    });
};

addEmployee = () => {
  let roleOptions = [];
  for (i = 0; i < roles.length; i++) {
    roleOptions.push(Object(roles[i]));
    // console.log(roleOptions[i].title);
  }
  let managerOptions = [];
  for (i = 0; i < managers.length; i++) {
    managerOptions.push(Object(managers[i]));
    console.log(managerOptions[i].managers);
  }
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter employee first name.",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter employee last name.",
      },
      {
        name: "role_id",
        type: "list",
        message: "Select employee department.",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < roleOptions.length; i++) {
            choiceArray.push(roleOptions[i].title);
          }
          return choiceArray;
        },
      },
      {
        name: "manager_id",
        type: "input",
        message: "Enter employee's manager.",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < managerOptions.length; i++) {
            choiceArray.push(managerOptions[i].managers);
          }
          return choiceArray;
        },
      },
    ])
    .then(function (answer) {
      // console.log(answer.role_id);
      // console.log(roleOptions);
      for (i = 0; i < roleOptions.length; i++) {
        if (roleOptions[i].title === answer.role_id) {
          console.log(roleOptions[i].id);
          role_id = roleOptions[i].id;
          console.log(role_id);
        }
      }
      // console.log(departmentOptions[i].id);
      for (i = 0; i < managerOptions.length; i++) {
        if (managerOptions[i].managers === answer.manager_id) {
          manager_id = managerOptions[i].id;
        }
      }

      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`,
        function (err, res) {
          if (err) throw err;
          // console.log("1 new employee added: " + answer.title);
          getEmployees();
          start();
        }
      );
    });
};

// VIEW FUNCTIONS

view = () => {
  inquirer
    .prompt([
      {
        name: "view",
        type: "list",
        message: "Select what you would like to view.",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
      },
    ])
    .then((answer) => {
      console.log(answer.view);
      if (answer.view === "DEPARTMENT") {
        viewDepartments();
      } else if (answer.view === "ROLE") {
        viewRoles();
      } else if (answer.view === "EMPLOYEE") {
        viewEmployees();
      } else if (answer.view === "EXIT") {
        // console.log("Exit");
        connection.end();
      }
    });
};

viewDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    figlet("Department", (err, result) => {
      console.log(err || result);
    });
    printTable(res);
    start();
  });
};

viewRoles = () => {
  connection.query(
    "SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id",
    function (err, res) {
      if (err) throw err;
      figlet("Roles", (err, result) => {
        console.log(err || result);
      });
      printTable(res);
      start();
    }
  );
};

viewEmployees = () => {
  connection.query(
    'SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC',
    function (err, res) {
      if (err) throw err;
      figlet("Employees", (err, result) => {
        console.log(err || result);
      });
      printTable(res);
      start();
    }
  );
};

// UPDATE FUNCTIONS
update = () => {
  inquirer
    .prompt([
      {
        name: "update",
        type: "list",
        message: "Select to update:",
        choices: ["Employee Role", "Employee Manager", "EXIT"],
      },
    ])
    .then((answer) => {
      if (answer.update === "Employee Role") {
        updateRole();
      } else if (answer.update === "Employee Manager") {
        updateManager();
      } else if (answer.update === "EXIT") {
        connection.end();
      } else {
        connection.end();
      }
    });
};

updateRole = () => {
  let employeeOptions = [];

  for (var i = 0; i < employees.length; i++) {
    employeeOptions.push(Object(employees[i]));
  }
  inquirer
    .prompt([
      {
        name: "updateRole",
        type: "list",
        message: "Select employee to update.",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < employeeOptions.length; i++) {
            choiceArray.push(employeeOptions[i].Employee_Name);
          }
          return choiceArray;
        },
      },
    ])
    .then((answer) => {
      let roleOptions = [];
      for (i = 0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
      }
      for (i = 0; i < employeeOptions.length; i++) {
        if (employeeOptions[i].Employee_Name === answer.updateRole) {
          employeeSelected = employeeOptions[i].id;
        }
      }
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "list",
            message: "Select a new role:",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < roleOptions.length; i++) {
                choiceArray.push(roleOptions[i].title);
              }
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          for (i = 0; i < roleOptions.length; i++) {
            if (answer.newRole === roleOptions[i].title) {
              newChoice = roleOptions[i].id;
              connection.query(
                `UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`
              ),
                (err, res) => {
                  if (err) throw err;
                };
            }
          }
          getEmployees();
          getRoles();
          start();
        });
    });
};

updateManager = () => {
  let employeeOptions = [];

  for (var i = 0; i < employees.length; i++) {
    employeeOptions.push(Object(employees[i]));
  }
  inquirer
    .prompt([
      {
        name: "updateManager",
        type: "list",
        message: "Select employee manager to update.",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < employeeOptions.length; i++) {
            choiceArray.push(employeeOptions[i].Employee_Name);
          }
          return choiceArray;
        },
      },
    ])
    .then((answer) => {
      getEmployees();
      getManagers();
      let managerOptions = [];
      for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
      }
      for (i = 0; i < employeeOptions.length; i++) {
        if (employeeOptions[i].Employee_Name === answer.updateManager) {
          employeeSelected = employeeOptions[i].id;
        }
      }
      inquirer
        .prompt([
          {
            name: "newManager",
            type: "list",
            message: "Select a new manager:",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < managerOptions.length; i++) {
                choiceArray.push(managerOptions[i].managers);
              }
              return choiceArray;
            },
          },
        ])
        .then((answer) => {
          for (i = 0; i < managerOptions.length; i++) {
            if (answer.newManager === managerOptions[i].managers) {
              newChoice = managerOptions[i].id;
              connection.query(
                `UPDATE employee SET manager_id = ${newChoice} WHERE id = ${employeeSelected}`
              ),
                (err, res) => {
                  if (err) throw err;
                };
            }
          }
          getEmployees();
          getManagers();
          start();
        });
    });
};
