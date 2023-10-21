INSERT INTO department (name)
VALUES  ("Information Technology"), 
        ("Human Resources"), 
        ("Accounting"), 
        ("Party Planning Committee"), 
        ("Reception"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Software Engineer", 150000.00, 1), 
        ("HR Manager", 100000.00, 2), 
        ("Accountant", 75000.00, 3), 
        ("Head Party Planner", 20000.00, 4), 
        ("Sales Rep", 100000.00, 6),
        ("Receptionist", 50000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Nick", "(Glasses)", 1, NULL), 
        ("Toby", "Flenderson", 2, NULL),
        ("Kevin", "Malone", 3, NULL), 
        ("Angela", "Martin", 4, NULL), 
        ("Pam", "Beesly", 5, NULL),
        ("Jim", "Halpert", 6, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Michael", "Scott", 6, 1), 
        ("Jan", "Levinson", 4, 3), 
        ("Andy", "Bernard", 1, 1), 
        ("Holly", "Flax", 2, 2), 
        ("Ryan", "Howard", 5, 5),
        ("Gabe", "Lewis", 6, 6);