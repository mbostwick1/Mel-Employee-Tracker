USE employee_db;

INSERT INTO department (name)
VALUES ("Account"), ("Creative"), ("Finance"), ("HR"), ("Media Planning"), ("Studio");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES 
("Account Executive", "60000", 1), 
("Designer", "70000", 2), 
("Financial Analyst", "70000", 3), 
("HR Coordinator", "75000", 4),
("Media Buyer", "50000", 5), 
("Senior Designer", "80000", 6),
("Manager", "120000", 7); 

SELECT * FROM role;

-- MANAGERS
INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Brooke", "Haynes", 7),
("Fred", "Bray", 7),
("Laura", "Steele", 7),
("Richard", "Ward", 7);

-- EMPLOYEES
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Amy", "Small", 1, 4), 
("Mo", "Lockard", 2, 1), 
("Morgan", "Barber", 3, 3), 
("Paige", "Stockton", 4, 3), 
("Gary", "Templeton", 5, 4), 
("Robyn", "Beyah", 5, 4),
("Melanie", "Bostwick", 6, 1),
("David", "Burns", 6, 1);

SELECT * FROM employee;

-- View all employees --
SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC;

-- View all roles --
SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id;

-- Get employee --
SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee

-- Update employee --
UPDATE employee SET role_id = 3 WHERE id = 8;


