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
        case "Add Employees":
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
    "SELECT roles.id AS RoleID,roles.title AS JOB_TITLE,department.dept_name AS Department_Name,roles.salary AS Salary from roles JOIN department ON roles.department_id=department.id ORDER BY roles.id";
  db.query(qry, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function viewEmployees() {
  let qry =
    "SELECT employee.id,employee.first_name,employee.last_name,department.dept_name,roles.title,roles.salary,employee.manager_id from roles JOIN employee on employee.roles_id=roles.id JOIN department on department_id= roles.department_id ORDER BY employee.id ";
  db.query(qry, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function addEmployee() {
  let roleArray = [];
  let empArray = [];
  let qry = "Select * from roles";
  db.query(qry, (err, results) => {
    if (err) throw err;
    let qry2 = "Select * from employee";
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
              for (let i = 0; i < results.length; i++) {
                roleArray.push(results[i].title);
              }
              return roleArray;
            },
          },
          {
            name: "managerid",
            type: "list",
            message: "Enter the manager id if there is a manager",
            choices: function () {
              for (let j = 0; j < results2.length; j++) {
                empArray.push(results2[j].first_name);
              }
              return empArray;
            },
          },
        ])
        .then((answer) => {
          let manager_ID = empArray.indexOf(answer.managerid) + 1;
          let roleid = roleArray.indexOf(answer.role) + 1;
          let qry =
            "INSERT INTO employee(first_name,last_name,roles_id,manager_id)VALUES(?,?,?,?)";
          db.query(
            qry,
            [answer.firstname, answer.lastname, roleid, manager_ID],
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
function addRoles() {
  let choiceArray = [];
  db.query("select * from department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "roletitle",
          type: "input",
          message: "Enter the role title",
        },
        {
          name: "rolesalary",
          type: "input",
          message: "Enter the salary for the role",
        },
        {
          name: "dept",
          type: "list",
          message: "Enter the department name of the role",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(results[i].dept_name);
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
          [answer.roletitle, answer.rolesalary, deptID],
          (err, results) => {
            if (err) throw err;
            console.log("New role added successfully");

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
      let qry = "INSERT INTO department (dept_name) VALUES (?)";
      db.query(qry, answer.departmentname, (err, results) => {
        if (err) throw err;
        console.log("NEW DEPARTMENT ADDED ");
        viewDepartment();
      });
    });
}
