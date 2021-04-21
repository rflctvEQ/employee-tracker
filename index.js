const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'judochop',
    database: 'employee_trackerDB'
});

// Once database is connected, start inquirer prompts
connection.connect(err => {
    if (err) throw err
    console.log("connected as ID" + connection.threadId)
    init();
});

const init = function () {
    inquirer.prompt([
        {
            name: 'homeQuestion',
            message: 'How would you like to proceed?',
            type: 'list',
            choices: [
                'View all employees',
                'View all employee roles',
                'View all departments',
                'Update employee\'s role',
                'Add employee',
                'Add role',
                'Add department'
            ]
        }
    ]).then(data => {
        // depending on user respose, queue relevant function 
        switch (data.homeQuestion) {
            case 'View all employees':
                console.log('case 1')
                viewEmployees();
                break;
            case 'View all employee roles':
                viewRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'Update employee\'s role':
                updateEmployeeRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add department':
                addDepartment();
                break;
        };
    });
};

// View all employees
const viewEmployees = function () {
    // console.log('Viewing employees!');
    connection.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, " " , e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;',
        function (err, res) {
            if (err) throw err
            console.table(res)
            init();
        });
};

// View all roles 
const viewRoles = function () {
    connection.query('SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;',
        function (err, res) {
            if (err) throw err
            console.table(res)
            init();
        })
};

// View all departments 
const viewDepartments = function () {
    connection.query('SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;',
        function (err, res) {
            if (err) throw err
            console.table(res)
            init();
        })
};

// Update existing employee's role
const updateEmployeeRole = function () {
    connection.query('SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;',
        function (err, res) {
            if (err) throw err
            inquirer.prompt([
                {
                    name: 'lastName',
                    message: 'Which employee would you like to update?',
                    type: 'list',
                    choices: () => {
                        let lastName = [];
                        for (let i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    }
                },
                {
                    name: 'roleSelect',
                    message: 'What is the employee\'s new role?',
                    type: 'list',
                    choices: getRoles()
                }
            ]).then(data => {
                let roleId = getRoles().indexOf(data.roleSelect) + 1;
                connection.query('UPDATE employee SET ? WHERE ?',
                [{
                    role_id: roleId
                },
                {
                    last_name: data.lastName
                }],
                err => {
                    if (err) throw err 
                    console.table(data)
                    init();
                })
            })
        })
};

// Add new employee 
const addEmployee = function () {
    inquirer.prompt([
        {
            name: 'firstName',
            message: 'Enter employee\'s first name',
            type: 'input'
        },
        {
            name: 'lastName',
            message: 'Enter employee\'s last name',
            type: 'input'
        },
        {
            name: 'role',
            message: 'What is the employee\'s role?',
            type: 'list',
            choices: getRoles()
        }
    ]).then(data => {
        let roleId = getRoles().indexOf(data.role) + 1;
        connection.query('INSERT INTO employee SET ?',
        {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: roleId
        },
        err => {
            if (err) throw err
            console.table(data)
            init();
        })
    })
};

// Add new role 
const addRole = function () {
    connection.query('SELECT role.title AS Title, role.salary AS Salary FROM role',
        function (err, res) {
            inquirer.prompt([
                {
                    name: 'roleName',
                    message: 'What is the name of this new role?',
                    type: 'input'
                },
                {
                    name: 'salary',
                    message: 'What is the salary of this new role?',
                    type: 'input'
                }
            ]).then(data => {
                connection.query('INSERT INTO role SET ?',
                {
                    title: data.roleName,
                    salary: data.salary
                },
                err => {
                    if (err) throw err
                    console.table(data)
                    init()
                })
            })
        })
};

// Add new department 
const addDepartment = function () {
    inquirer.prompt([
        {
            name: 'departmentName',
            message: 'What is the name of the new department?',
            type: 'input'
        }
    ]).then(data => {
        connection.query('INSERT INTO department SET ?',
        {
            name: data.departmentName
        },
        err => {
            if (err) throw err
            console.table(data)
            init();
        })
    })
};

// function for providing list of roles for updateEmployeeRole
let roles = [];
const getRoles = function () {
    connection.query('SELECT * FROM role;',
        function (err, res) {
            if (err) throw err
            for (let i = 0; i < res.length; i++) {
                roles.push(res[i].title);
            }
        })
    return roles
};