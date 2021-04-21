-- Creating database
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

-- Telling MySQL to use our database
USE employee_trackerDB;

-- Creating table for departments
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

-- Creating table for roles
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT, 
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Creating table for employees
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT, 
    role_id INT, 
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Adding some content to Department table 
INSERT INTO department (name)
VALUE ("Technology");
INSERT INTO department (name)
VALUE ("Analytics");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Human Resources");

-- Adding some content to Role table
INSERT INTO role (title, salary, department_id)
VALUE ("Junior Developer", 65000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Developer", 85000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Senior Developer", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Data Analytics Specialist", 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 70000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Human Resources Manger", 75000, 4);

-- Adding some content to Employee table 
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Ian", "Everitt", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Evan", "Applegate", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Celeste", "Blakeny", 1, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Lulu", "Cao", 2, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("David", "Stone", null, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Julian", "Faraon", null, 6);

-- Telling Workbench which tables to select
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee; 