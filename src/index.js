// Node packages: inquirer@8.2.4 & mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a connection pool with mysql2
const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "empl_tracker_db",
  })
  .promise();

// View all departments
const viewDeparts = async () => {
  const [rows] = await pool.query("SELECT * FROM department;");
  console.table(rows);
};

// View All Roles
const viewRoles = async () => {
  let query = `
    SELECT  r.id,
            r.title,
            r.salary,
            r.department_id,
            d.name
    FROM role r
    JOIN department d ON r.department_id = d.id;
  `;

  const [rows] = await pool.query(query);
  console.table(rows);
};

// View All Employees
const viewEmpl = async () => {
  let query = `
    SELECT  e.id,
            e.first_name,
            e.last_name,
            e.manager_id,
            r.title,
            r.salary,
            d.name
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    ORDER BY e.id;
  `;

  const [rows] = await pool.query(query);
  console.table(rows);
};

// Add a Department
const addDept = async () => {
  try {
    const dept = await inquirer.prompt({
      name: "deptAdded",
      type: "input",
      message: "Name of the department:",
      validate: (name) => {
        return name
          ? true
          : console.log("Please enter a name for the new department:", false);
      },
    });
    const { deptAdded } = dept;

    await pool.query(
      `
        INSERT INTO department (name) 
        VALUES (?)`,
      [deptAdded]
    );
    return viewDeparts();
  } catch (err) {
    console.log(err);
  }
};

// Add a Role
const addRole = async () => {
  try {
    const [departments] = await pool.query(`SELECT * FROM department;`);
    const deptName = departments.map((dept) => dept.name).filter(arr => arr != null);

    const role = await inquirer.prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Title of the role:",
        validate: (title) => {
          return title
            ? true
            : console.log("Please enter a title for the new role:", false);
        },
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Salary of the role:",
        validate: (salary) => {
          return salary
            ? true
            : console.log("Please enter a salary for the new role:", false);
        },
      },
      {
        name: "roleDeptName",
        type: "list",
        message: "Which department does the new role belongs to?",
        choices: [...deptName],
      },
    ]);
    const { roleTitle, roleSalary, roleDeptName } = role;

    const selectedDept = departments.find((dept) => dept.name === roleDeptName);
    const roleDeptId = selectedDept.id;

    await pool.query(
      `INSERT INTO role (title, salary, department_id) 
      VALUES (?, ?, ?)`,
      [roleTitle, roleSalary, roleDeptId]
    );
    return await viewRoles();
  } catch (err) {
    console.log(err);
  }
};

//Add an Employee
const addEmpl = async () => {
  try {
    const [roles] = await pool.query(`SELECT * FROM role;`);
    const roleTitle = roles.map((role) => role.title).filter(arr => arr != null);

    const [managers] = await pool.query(`SELECT * FROM employee;`);
    const managerName = managers.map(
      (name) => `${name.first_name} ${name.last_name}`
    );

    const employee = await inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "First name of the employee:",
        validate: (first) => {
          return first
            ? true
            : console.log("Please enter a first name for the employee", false);
        },
      },
      {
        name: "lastName",
        type: "input",
        message: "Last name of the employee:",
        validate: (last) => {
          return last
            ? true
            : console.log("Please enter a last name for the employee", false);
        },
      },
      {
        name: "employeeRole",
        type: "list",
        message: "What is the employee's role?",
        choices: [...roleTitle],
      },
      {
        name: "employeeManager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: [...managerName],
      },
    ]);
    const { firstName, lastName, employeeRole, employeeManager } = employee;

    const selectedRole = roles.find((role) => role.title === employeeRole);
    const roleId = selectedRole.id;

    const selectedManager = managers.find(
      (manager) =>
        `${manager.first_name} ${manager.last_name}` === employeeManager
    );
    const managerId = selectedManager.id;

    await pool.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES (?, ?, ?, ?)`,
      [firstName, lastName, roleId, managerId]
    );
    return await viewEmpl();
  } catch (err) {
    console.log(err);
  }
};

// Remove a Department
const removeDept = async () => {
  try {
    const [departments] = await pool.query(`SELECT * FROM department;`);
    const deptName = departments
      .map((dept) => dept.name)
      .filter((arr) => arr != null);

    const dept = await inquirer.prompt({
      name: "deptRemoved",
      type: "list",
      message: "Please select a department to remove:",
      choices: [...deptName],
    });
    const { deptRemoved } = dept;

    await pool.query(`UPDATE department SET name = NULL WHERE name = ?;`, [
      deptRemoved,
    ]);

    await pool.query(
      `
    DELETE FROM department WHERE name = ?;
    `,
      [deptRemoved]
    );

    return await viewDeparts();
  } catch (err) {
    console.log(err);
  }
};

// Remove a Role
const removeRole = async () => {
  try {
    const [roles] = await pool.query(`SELECT * FROM role;`);
    const roleTitle = roles
      .map((role) => role.title)
      .filter((arr) => arr != null);

    const role = await inquirer.prompt({
      name: "roleRemoved",
      type: "list",
      message: "Select a role to remove:",
      choices: [...roleTitle],
    });
    const { roleRemoved } = role;

    await pool.query(
      `
      UPDATE role 
      SET title = NULL, salary = NULL
      WHERE title = ? 
      `,
      [roleRemoved]
    );

    await pool.query(
      `
    DELETE FROM role WHERE title = ?;
    `,
      [roleRemoved]
    );

    return await viewRoles();
  } catch (err) {
    console.log(err);
  }
};

// Remove an Employee
const removeEmpl = async () => {
  try {
    const [employees] = await pool.query(`SELECT * FROM employee;`);
    const employeeName = employees.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    const employee = await inquirer.prompt({
      name: "employeeRemoved",
      type: "list",
      message: "Please select an employee to remove:",
      choices: [...employeeName],
    });
    const { employeeRemoved } = employee;

    const checkEmployee = employees.find(
      (e) => `${e.first_name} ${e.last_name}` === employeeRemoved
    );

    if (checkEmployee.manager_id === null) {
      const changeManager = employees.filter(
        (e) => e.manager_id == checkEmployee.id
      );
      const updateManager = changeManager.map(
        (name) => `${name.first_name} ${name.last_name}`
      );
      updateManager.forEach(async (name) => {
        await pool.query(
          `
            UPDATE employee
            SET manager_id = NULL
            WHERE CONCAT(first_name, ' ', last_name) = ?;
          `,
          [name]
        );
      });
    } else {
      const changeManager = employees.filter(
        (e) => e.manager_id == checkEmployee.id
      );
      const updateManager = changeManager.map(
        (name) => `${name.first_name} ${name.last_name}`
      );
      updateManager.forEach(async (name) => {
        await pool.query(
          `
            UPDATE employee
            SET manager_id = NULL
            WHERE CONCAT(first_name, ' ', last_name) = ?;
          `,
          [name]
        );
      });
    }

    await pool.query(
      `
        DELETE FROM employee 
        WHERE CONCAT(first_name, ' ', last_name) = ?;
      `,
      [employeeRemoved]
    );

    return await viewEmpl();
  } catch (err) {
    console.log(err);
  }
};

// Update an Employee Role
const updateRole = async () => {
  try {
    const [employeeNames] = await pool.query(`SELECT * FROM employee;`);
    const selectEmployee = employeeNames.map(
      (names) => `${names.first_name} ${names.last_name}`
    );

    const [employeeRoles] = await pool.query(`SELECT * FROM role;`);
    const selectRole = employeeRoles
      .map((role) => role.title)
      .filter((arr) => arr != null);

    const data = await inquirer.prompt([
      {
        name: "updateEmployee",
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: [...selectEmployee],
      },
      {
        name: "updateRole",
        type: "list",
        message: "Which role do you want to assign to the selected employee?",
        choices: [...selectRole],
      },
    ]);
    const { updateEmployee, updateRole } = data;

    const updateRoleId = employeeRoles.find(
      (role) => role.title === updateRole
    );
    const { id } = updateRoleId;

    await pool.query(
      `
        UPDATE employee AS e
        SET e.role_id = ?
        WHERE CONCAT(e.first_name, ' ', e.last_name) = ?
        `,
      [id, updateEmployee]
    );

    const [results] = await pool.query(
      `SELECT * FROM employee JOIN role ON employee.role_id = role.id;`
    );
    console.table(results);
  } catch (err) {
    console.log(err);
  }
};

// Update Employee Managers
const updateManager = async () => {
  try {
    const [employees] = await pool.query(`SELECT * FROM employee;`);
    const employeeNames = employees.map(
      (e) => `${e.first_name} ${e.last_name}`
    );

    const data = await inquirer.prompt([
      {
        name: "selectedEmployee",
        type: "list",
        message:
          "Select the employee who will be reassigned a different manager:",
        choices: [...employeeNames],
      },
      {
        name: "managerSelected",
        type: "list",
        message: "Reassign this employee's manager to:",
        choices: [...employeeNames, "NULL"],
      },
    ]);
    const { selectedEmployee, managerSelected } = data;

    if (managerSelected === "NULL") {
      await pool.query(
        `
      UPDATE employee AS e
      SET e.manager_id = NULL
      WHERE CONCAT(e.first_name, ' ', e.last_name) = ?
      `,
        [selectedEmployee]
      );
    } else {
      const { id } = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === managerSelected
      );

      await pool.query(
        `
        UPDATE employee AS e
        SET e.manager_id = ?
        WHERE CONCAT(e.first_name, ' ', e.last_name) = ?
        `,
        [id, selectedEmployee]
      );
    }

    return await viewEmpl();
  } catch (err) {
    console.log(err);
  }
};

// View Employee By Manager
const viewByManager = async () => {
  try {
    const [result] = await pool.query(`
      SELECT
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
        GROUP_CONCAT(CONCAT(e.first_name, ' ', e.last_name)) AS employee_names
      FROM
        employee e
      JOIN
        employee m ON e.manager_id = m.id
      GROUP BY
        m.id
      ORDER BY
        m.id;
    `);
    console.table(result)
  } catch (err) {
    console.log(err);
  }
};

// View Employee By Department
const viewByDept = async () => {
  try {
    const [result] = await pool.query(`
      SELECT
        d.name AS department,
        GROUP_CONCAT(CONCAT(e.first_name, ' ', e.last_name)) AS employee_name
      FROM
        department d
      JOIN
        role r ON d.id = r.department_id
      JOIN
        employee e ON r.id = e.role_id
      WHERE
        d.name IS NOT NULL
      GROUP BY
        d.id
      ORDER BY
        d.id;
    `)

    console.table(result)
  } catch (err) {
    console.log(err)
  }
}

// View Total Utilized Budget of Department
const viewBudget = async () => {
  const query = `
    SELECT d.name AS department_name, COALESCE(SUM(r.salary), 0) AS total_salary
    FROM department d
    JOIN role r ON d.id = r.department_id
    JOIN employee e ON r.id = e.role_id
    WHERE d.name IS NOT NULL
    GROUP BY d.name;
  `;
  const [result] = await pool.query(query);
  console.table(result);
};

module.exports = {
  viewDeparts,
  viewRoles,
  viewEmpl,
  addDept,
  addRole,
  addEmpl,
  updateManager,
  removeDept,
  removeRole,
  removeEmpl,
  updateRole,
  viewByManager,
  viewByDept,
  viewBudget,
};