const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


const teamMembers = []

function getEmployeeInfo(){
    inquirer.prompt([
      {type: "input",
        message: "What's the employee's name?",
        name: "employeeName"
      },
      {
        type: "input",
        message: "What's the employee's ID?",
        name: "employeeID"
      },
      {
        type: "input",
        message: "What's the employee's email?",
        name: "employeeEmail"
      },
      {
        type: "list",
        message: "What's the employee's role?",
        choices:["Manager", "Engineer", "Intern"],
        name: "employeeRole"
      },
      // If manager
      {
        type: "input",
        message: "What's the manager's office number?",
        name: "managerNumber",
        when: response => {
          return (response.employeeRole === "Manager")
        }
      },
      // If engineer
      {
        type: "input",
        message: "What's the employee's github username?",
        name: "engGithub",
        when: response => {
          return (response.employeeRole === "Engineer")
        },
      },
      // If Intern
      {
        type: "input",
        message: "What's the intern's school name?",
        name: "internSchool",
        when: response => {
          return (response.employeeRole === "Intern")
        }
      },
    ]).then(function(response){
      // if manager
      if(response.employeeRole === "Manager"){
        let manager = new Manager(response.employeeName, response.employeeID, response.employeeEmail, response.managerNumber)
        teamMembers.push(manager)
        addEmployee()
      }
      // if engineer
      if(response.employeeRole === "Engineer"){
        let engineer = new Engineer(response.employeeName, response.employeeID, response.employeeEmail, response.engGithub)
        teamMembers.push(engineer)
        addEmployee()
      }
      // if intern
      if(response.employeeRole === "Intern"){
        let intern = new Intern(response.employeeName, response.employeeID, response.employeeEmail, response.internSchool)
        teamMembers.push(intern)
        addEmployee()
      }
    })
}

function addEmployee() {
  inquirer.prompt([
    {
      type: "confirm",
      message: "Do you want to add another team member?",
      name: "addEmployee"
    }
  ]).then(function(response){
    if(response.addEmployee){
      getEmployeeInfo()
    }else{
      var teamHTML = render(teamMembers)
      fs.writeFile(outputPath, teamHTML, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("Success!");
      })
    }
  })
}

getEmployeeInfo();
