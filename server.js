const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { createPromptModule } = require("inquirer");

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
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "View by Department",
        "View by Manager",
        "View Department Budget",
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "View by Department":
          viewBydept();
          break;
        case "View by Manager":
          viewBymanager();
          break;
        case "View Department Budget":
          departmentBudget();
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
    " SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name AS department, roles.salary,  CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.roles_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";

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
  db.query("SELECT * FROM department", (err, results) => {
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

function updateEmployeeRole() {
  let empnameArray = [];
  let qry = "SELECT * FROM employee";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeename",
          type: "list",
          message: "Select the employee you wish to update",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              empnameArray.push(
                results[i].id +
                  "." +
                  results[i].first_name +
                  " " +
                  results[i].last_name
              );
            }
            return empnameArray;
          },
        },
      ])
      .then((answer) => {
        let empID = empnameArray.indexOf(answer.employeename) + 1;

        updateRole(empID);
      });
  });
}

function updateRole(empID) {
  let newRoleArray = [];
  let qry2 = "SELECT * FROM roles";
  db.query(qry2, (err, results2) => {
    if (err) throw err;
    console.log(results2);
    inquirer
      .prompt([
        {
          name: "roletitle",
          type: "list",
          message: "Select the new role for the employee",
          choices: function () {
            for (let j = 0; j < results2.length; j++) {
              newRoleArray.push(results2[j].title);
            }

            return newRoleArray;
          },
        },
      ])
      .then((answer) => {
        let newrole = answer.roletitle;
        let roleid = newRoleArray.indexOf(newrole) + 1;

        let qry = "UPDATE employee SET roles_id = ? WHERE employee.id = ?";
        db.query(qry, [roleid, empID], (err, results) => {
          if (err) throw err;
          console.log("Employee Role updated");
          //console.tables(results);
          viewEmployees();
        });
      });
  });
}
function deleteDepartment() {
  let deptArray = [];
  let qry = "SELECT * FROM department";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select the department you wish to delete",
          choices: function () {
            for (var i = 0; i < results.length; i++) {
              deptArray.push(results[i].dept_name);
            }
            return deptArray;
          },
        },
      ])
      .then((answer) => {
        let deptID = deptArray.indexOf(answer.department) + 1;

        let qry1 = "DELETE FROM department WHERE id =?";
        db.query(qry1, [deptID], (err, results1) => {
          if (err) throw err;
          console.log("Department deleted successfully");
          viewDepartment();
        });
      });
  });
}
function deleteRole() {
  let roleArray = [];
  let qry = "SELECT * FROM roles";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Select the role you wish to delete",
        choices: function () {
          for (let i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
          }
          return roleArray;
        },
      })
      .then((answer) => {
        let roleid = roleArray.indexOf(answer.role) + 1;
        let qry = "DELETE FROM roles WHERE id =?";
        db.query(qry, [roleid], (err, results1) => {
          if (err) throw err;
          console.log("Deleted the selected role successfully");
          viewRoles();
        });
      });
  });
}

function deleteEmployee() {
  let empnameArray = [];

  let qry = "SELECT * FROM employee";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeename",
          type: "list",
          message: "Select employee whom you wish to delete",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              empnameArray.push(
                results[i].id +
                  "." +
                  results[i].first_name +
                  " " +
                  results[i].last_name
              );
            }
            return empnameArray;
          },
        },
      ])
      .then((answer) => {
        let empid = empnameArray.indexOf(answer.employeename) + 1;
        console.log(empid);
        let qry = "DELETE FROM employee where id=?";
        db.query(qry, empid, (err, results2) => {
          if (err) throw err;
          console.log("Selected Employee Deleted");
          viewEmployees();
        });
      });
  });
}
function viewBydept() {
  let deptArray = [];
  let qry = "select * from department";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "deptname",
          type: "list",
          message: "Select the department to view employees by departments",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              deptArray.push(results[i].dept_name);
            }
            return deptArray;
          },
        },
      ])
      .then((answer) => {
        let deptid = deptArray.indexOf(answer.deptname) + 1;
        console.log(deptid);
        let qry1 =
          "SELECT employee.id,employee.first_name,employee.last_name,roles.salary,roles.title,department.dept_name FROM roles JOIN employee on employee.roles_id=roles.id JOIN department on department.id=roles.department_id WHERE department.id=? ";
        db.query(qry1, deptid, (err, results1) => {
          if (err) throw err;
          console.table(results1);
          start();
        });
      });
  });
}
function viewBymanager() {
  let managerArray = [];
  let qry = "SELECT * FROM employee WHERE manager_id >=0";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "manager",
          type: "list",
          message: "Select the manager to view employees by manager",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              managerArray.push(results[i].manager_id);
            }
            return managerArray;
          },
        },
      ])
      .then((answer) => {
        let managerid = managerArray.indexOf(answer.manager) + 1;
        console.log(managerid);
        let qry1 =
          "SELECT first_name,last_name,manager_id FROM employee where manager_id=?";
        db.query(qry1, managerid, (err, results1) => {
          if (err) throw err;
          console.table(results1);
          start();
        });
      });
  });
}

function departmentBudget() {
  let deptArray = [];
  let qry = "SELECT * from DEPARTMENT";
  db.query(qry, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "deptname",
          type: "list",
          message: "Select the department ,to view its utilized budget",
          choices: function () {
            for (let i = 0; i < results.length; i++) {
              deptArray.push(results[i].dept_name);
            }
            return deptArray;
          },
        },
      ])
      .then((answer) => {
        let deptid = deptArray.indexOf(answer.deptname) + 1;
        console.log(deptid);
        let qry2 =
          "SELECT department.dept_name,SUM(roles.salary) FROM roles JOIN department WHERE roles.department_id=department.id ";
        db.query(qry2, deptid, (err, results2) => {
          if (err) throw err;
          console.table(results2);
          start();
        });
      });
  });
}
function exitPrompt() {
  db.end();
}
