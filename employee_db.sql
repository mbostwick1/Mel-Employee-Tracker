DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

-- * **department**:
--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id) 
);

-- * **role**:

--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT,
  PRIMARY KEY (id) 
);

-- * **employee**:

--   * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id) 
);

INSERT INTO department (name)
VALUES ("Account"), ("Creative"), ("Finance"), ("HR"), ("Media Planning"), ("Studio");

INSERT INTO role (title, salary, department_id)
VALUES 
("Account Executive", "60000", "1"), 
("Designer", "70000", "2"), 
("Financial Analyst", "70000", "3"), 
("HR Coordinator", "75000", "4"),
("Media Buyer", "50000", "5"), 
("Senior Designer", "80000", "6"),
("CEO", "150000", "7"); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Amy", "Small", "1", "7"), 
("Mo", "Lockard", "2", "7"), 
("Morgan", "Barber", "3", "7"), 
("Paige", "Stockton", "4", "7"), 
("Gary", "Templeton", "5", "7"), 
("Melanie", "Bostwick", "6", "7"), 
("Richard", "Ward", "7", "7");

-- SELECT * FROM role;
-- SELECT * FROM employee;
