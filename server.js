const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require('console.table');
  
const db = mysql.createConnection({
    host: "localhost",
    user : "root",
    password: "abcd",
    database: "employee_db",
});

db.connect((err) =>{
    if(err) throw err;
    console.log("Connected to employee database");
    start();

});

function start(){
    inquirer.prompt({
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
            "Exit"
        ]
    }). then ((answer)=>{
        switch(answer.task){
            case "View all Departments":
                viewDepartment();
                break;
            case "View all Employees" :
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
            case "Upadate Employee Role":
                updateEmployeeRole();
                break;
            case "Exit":
                exitPrompt();
                break;
        }

    });
}

function viewDepartment(){
    let qry = "SELECT * FROM department";
    db.query(qry,(err,results)=>{
        if(err) throw err;
        console.table(results);
        start();
    })
}

function viewRoles(){
    let qry = "SELECT roles.id AS RoleID,roles.title AS JOB_TITLE department.name AS Department_Name,roles.salary AS Salary from roles join department ON roles.department_id=department.id ORDER BY roles.id";
    db.query(qry,(err,results)=>{
        if(err) throw err;
        console.table(results);
        start();
}
