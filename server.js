const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcd",
  database: "employee_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to employee database");
  start();
});

function start() {
  inquirer
    .prompt({
      name: "task",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add Department",
        "Add Roles",
        "Add Employees",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.task) {
        case "View all Departments":
          viewDepartment();
          break;
        case "View all Employees":
          viewEmployees();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Roles":
          addRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Upadate Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          exitPrompt();
          break;
      }
    });
}

function viewDepartment() {
  let qry = "SELECT * FROM department";
  db.query(qry, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function viewRoles() {
  let qry =
    "SELECT roles.id AS RoleID,roles.title AS JOB_TITLE department.name AS Department_Name,roles.salary AS Salary from role join department ON roles.department_id=department.id ORDER BY roles.id";
  db.query(qry, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function viewEmployees() {
  let qry =
    "SELECT employee.id,employee.first_name,employee.last_name,department.name,roles.title,roles.salary,employee.manager_id from role JOIN employee on employee.roles_id=roles.id JOIN department on department_id= roles.department_id ORDER BY employee.id ";
  db.query(qry, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function addEmployee() {
  let roleArray = [];
  let empArray = [];
  let qry = "SELECT * from roles";
  db.query(qry, (err, results) => {
    if (err) throw err;
    let qry2 = "SELECT * from employees";
    db.query(qry2, (err, results2) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "firstname",
            type: "input",
            message: " Enter the first name of employee",
          },
          {
            name: "lastname",
            type: "input",
            message: "Enter the lastname of employee",
          },
          {
            name: "role",
            type: "list",
            message: "Enter the employee's roleID",
            choices: function () {
              for (i = 0; i < results.length; i++) {
                roleArray.push(results[i].roles_title);
              }
              return roleArray;
            },
          },
          {
            name: "managerid",
            type: "list",
            message: "Enter the manager id if there is a manager",
            choices: function () {
              for (j = 0; j < results2.length; j++) {
                empArray.push(results2[j].first_name);
              }
              return empArray;
            },
          },
        ])
        .then((answer) => {
          let manager_id = empArray.indexOf(answer.managerid) + 1;
          let roleid = roleArray.indexOf(answer.role) + 1;
          let qry =
            "INSERT INTO employee(first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)";
          db.query(
            qry,
            [answer.firstname, answer.lastname, roleid, manager_id],
            (err, results) => {
              if (err) throw err;
              console.log("Employee added successfully");
              viewEmployees();
            }
          );
        });
    });
  });
}
function addRole() {
  let choiceArray = [];
  db.query("select * from department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role-title",
          type: "input",
          message: "Enter the role title",
        },
        {
          name: "role-salary",
          type: "input",
          message: "Enter the salary for the role",
        },
        {
          name: "dept",
          type: "list",
          message: "Enter the department name of the role",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
        },
      ])
      .then((answer) => {
        let departmentName = answer.dept;
        let deptID = choiceArray.indexOf(departmentName) + 1;
        let qry = "INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)";
        db.query(
          qry,
          [answer.role - title, answer.role - salary, deptID],
          (err, results) => {
            if (err) throw err;
            console.log("New role added successfully");
            console.table(results);
            viewRoles();
          }
        );
      });
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "departmentname",
      type: "input",
      message: "Enter the new department",
    })
    .then((answer) => {
      let qry = "INSERT INTO department (name) VALUES (?)";
      db.query(qry, answer.departmentname, (err, results) => {
        if (err) throw err;
        console.log("NEW DEPARTMENT ADDED ");
        viewDepartment();
      });
    });
}
