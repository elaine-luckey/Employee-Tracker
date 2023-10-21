const inquirer = require("inquirer");
const art = require("./src/ascii");
const index = require("./src/index");

//Start program with ASCII Art to show Employee Tracker, then the main inquirer.js prompts start
const startEmployeeTracker = () => {
  art();
  setTimeout(() => {
    promptInquirer();
  }, 1550);
};

//Going back to the main prompts after 500 milliseconds
const recallPrompt = () => {
  setTimeout(() => {
    promptInquirer();
  }, 500);
};

//Prompt inquirer.js using async-await
const promptInquirer = async () => {
  try {
    const data = await inquirer.prompt({
      name: "main",
      message: "What command would you like to perform?",
      type: "list",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Remove a department",                          //**Extra credit
        "Remove a role",                                //**Extra credit
        "Remove an employee",                           //**Extra credit
        "Update an employee role",
        "Update employee managers",                     //**Extra credit
        "View employees by manager",                    //**Extra credit
        "View employees by department",                 //**Extra credit
        "View total utilized budget of department",     //**Extra credit
        "Quit",
        
      ],
    });

    // Destructure key of main from object being returned
    const { main } = data;

    // Switch statements for functions to be called for each command
    switch (main) {
      case "View All Departments":
        index.viewDeparts().then(recallPrompt);
        break;
      case "View All Roles":
        index.viewRoles().then(recallPrompt);
        break;
      case "View All Employees":
        index.viewEmpl().then(recallPrompt);
        break;
      case "Add a Department":
        index.addDept().then(recallPrompt);
        break;
      case "Add a Role":
        index.addRole().then(recallPrompt);
        break;
      case "Add an Employee":
        index.addEmpl().then(recallPrompt);
        break;
      case "Remove a Department":
        index.removeDept().then(recallPrompt);
        break;
      case "Remove a Role":
        index.removeRole().then(recallPrompt);
        break;
      case "Remove an Employee":
        index.removeEmpl().then(recallPrompt);
        break;
      case "Update an Employee Role":
        index.updateRole().then(recallPrompt);
        break;
      case "Update Employee Managers":
        index.updateManager().then(recallPrompt);
        break;
      case "View Employees By Manager":
        index.viewByManager().then(recallPrompt);
        break;
      case "View Employees By Department":
        index.viewByDept().then(recallPrompt);
        break;
      case "View Total Utilized Budget of the Department":
        index.viewBudget().then(recallPrompt);
        break;
      case "Quit":
        console.log("You have quit the program.");
        process.exit(0);
    }
  } catch (err) {
    console.log(err);
  }
};

startEmployeeTracker();

module.exports = recallPrompt;