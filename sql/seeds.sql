INSERT INTO department (name)
VALUES ("Sales"),
       ("Information Technology"),
       ("Human Resources"),
       ("Finance"),
       ("Legal"),
       ("Social Media Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 100000.00, 1),
       ("Software Developer", 160000.00, 2),
       ("Technical Recruiter", 120000.00, 3),
       ("Financal Analyst", 140000.00, 4),
       ("Lawyer", 200000.00, 5),
       ("Social Media Manager", 80000.00, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Roger", "Thatch", 1, 1),
       ("Brenda", "Long", 2, 5),
       ("Samuel", "Parker", 3, 2),
       ("Cindy", "Louwho", 4, 2),
       ("Daisia", "Vu", 5, 1),
       ("Mark", "Cubano", 6, 3);

