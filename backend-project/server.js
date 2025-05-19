// this is system that will manage employees and their data in SmartPark that located in Rubavu
// The system will have the following features:
// Employee Management System API


const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const expressSession = require('express-session');

const app = express();
const PORT = 2025;

// Add this constant at the top with other constants
const JWT_SECRET = 'syper_secret_key';

// middlewares
app.use(cors({
    origin: 'http://localhost:3000', // don't use '*'
    credentials: true // allow cookies, authorization headers, etc
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'syper_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));


// Database connection

let db;

async function initializeDB() {
    try {
        const tempDB = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        })

        await tempDB.connect();

        await tempDB.query('CREATE DATABASE IF NOT EXISTS EPMS');
        await tempDB.close();

        // initialize the db connection

        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'EPMS'
        })

        await db.connect();

        // create admin table

        await db.query(`
            CREATE TABLE IF NOT EXISTS Admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)

        console.log('Admin table created');

        // create the tables if they don't exist

        await db.query(`
            CREATE TABLE IF NOT EXISTS Department (
                DepartmentCode VARCHAR(10) PRIMARY KEY,
                DepartmentName VARCHAR(100) NOT NULL,
                GrossSalary DECIMAL(12,2) NOT NULL
            );
        `);

        console.log('Department table created');

        await db.query(`
        CREATE TABLE IF NOT EXISTS Employee (
                EmployeeNumber VARCHAR(10) PRIMARY KEY,
                FirstName VARCHAR(50) NOT NULL,
                LastName VARCHAR(50) NOT NULL,
                Position VARCHAR(50) NOT NULL,
                Address VARCHAR(100) NOT NULL,
                Telephone VARCHAR(20) NOT NULL,
                Gender ENUM('Male', 'Female', 'Other') NOT NULL,
                HiredDate DATE NOT NULL,
                DepartmentCode VARCHAR(10),
                CONSTRAINT fk_employee_department
                     FOREIGN KEY (DepartmentCode)
                    REFERENCES Department(DepartmentCode)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE
            );
        `)

        console.log('Employee table created');

        await db.query(`
            CREATE TABLE IF NOT EXISTS Salary (
                EmployeeNumber VARCHAR(10),
                Month VARCHAR(20),
                GrossSalary DECIMAL(12,2) NOT NULL,
                TotalDeduction DECIMAL(12,2) NOT NULL,
                NetSalary DECIMAL(12,2) NOT NULL,
                PRIMARY KEY (EmployeeNumber, Month),
                CONSTRAINT fk_salary_employee
                    FOREIGN KEY (EmployeeNumber)
                    REFERENCES Employee(EmployeeNumber)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );
        `)

        console.log('Salary table created');

        await db.query(`
            CREATE TABLE IF NOT EXISTS Report (
                id INT AUTO_INCREMENT PRIMARY KEY,
                EmployeeNumber VARCHAR(10),
                FirstName VARCHAR(50),
                LastName VARCHAR(50),
                Position VARCHAR(50),
                DepartmentName VARCHAR(100),
                NetSalary DECIMAL(12,2),
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Report table created');


        return true

    } catch (err) {
        console.error('Error initializing database: ', err);
        return false;
    }
}



// initialize the database connection

initializeDB().then((result) => {
    if (result) {
        console.log('Database initialized successfully');
    } else {
        console.error('Error initializing database');
    }
}).catch((err) => {
    console.error('Error initializing database: ', err);
})

// middleware funtions

// function to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


// routes


// login route

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });  

app.post('/api/auth/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM Admin WHERE username = ? && password = ?', [name, password]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const admin = rows[0];
        // generate token with admin id and username
        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // set session token
        req.session.token = token;

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
                id: admin.id,
                username: admin.username
            }
        });

    } catch (err) {
        console.error('Error logging in: ', err);
        return res.status(500).json({
            status: false,
            message: 'Error logging in'
        });
    }
});

// logout route
app.post('/api/auth/logout', (req, res) => {
    if (req.session.token) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error logging out'
                });
            }
            return res.status(200).json({
                status: true,
                message: 'Logout successful'
            });
        });
    } else {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized'
        });
    }
});

// Get all employees
app.get('/api/employees', isAuthenticated, async (req, res) => {
    try {
        const [employees] = await db.query(`
            SELECT e.*, d.DepartmentName 
            FROM Employee e 
            LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
        `);

        return res.status(200).json({
            status: true,
            data: employees,
            message: employees.length === 0 ? 'No employees found' : 'Employees retrieved successfully'
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        return res.status(500).json({
            status: false,
            message: 'Error fetching employees'
        });
    }
});

// Get all departments
app.get('/api/departments', isAuthenticated, async (req, res) => {
    try {
        const [departments] = await db.query('SELECT * FROM Department');

        return res.status(200).json({
            status: true,
            data: departments,
            message: departments.length === 0 ? 'No departments found' : 'Departments retrieved successfully'
        });
    } catch (err) {
        console.error('Error fetching departments:', err);
        return res.status(500).json({
            status: false,
            message: 'Error fetching departments'
        });
    }
});

// Get all salaries
app.get('/api/salaries', isAuthenticated, async (req, res) => {
    try {
        const [salaries] = await db.query(`
            SELECT s.*, e.FirstName, e.LastName 
            FROM Salary s 
            JOIN Employee e ON s.EmployeeNumber = e.EmployeeNumber
        `);

        return res.status(200).json({
            status: true,
            data: salaries,
            message: salaries.length === 0 ? 'No salary records found' : 'Salaries retrieved successfully'
        });
    } catch (err) {
        console.error('Error fetching salaries:', err);
        return res.status(500).json({
            status: false,
            message: 'Error fetching salaries'
        });
    }
});

// Add new employee
app.post('/api/employees', isAuthenticated, async (req, res) => {
    try {
        const {
            EmployeeNumber,
            FirstName,
            LastName,
            Position,
            Address,
            Telephone,
            Gender,
            HiredDate,
            DepartmentCode
        } = req.body;

        // Start a transaction
        await db.beginTransaction();

        try {
            // 1. Insert into Employee table
            await db.query(`
                INSERT INTO Employee (
                    EmployeeNumber, FirstName, LastName, Position,
                    Address, Telephone, Gender, HiredDate, DepartmentCode
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                EmployeeNumber, FirstName, LastName, Position,
                Address, Telephone, Gender, HiredDate, DepartmentCode
            ]);

            // 2. Get department's gross salary
            const [department] = await db.query(
                'SELECT GrossSalary FROM Department WHERE DepartmentCode = ?',
                [DepartmentCode]
            );

            if (!department.length) {
                throw new Error('Department not found');
            }

            const grossSalary = department[0].GrossSalary;
            const totalDeduction = grossSalary * 0.1; // 10% deduction
            const netSalary = grossSalary - totalDeduction;

            // 3. Create initial salary record for current month
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            await db.query(`
                INSERT INTO Salary (
                    EmployeeNumber, Month, GrossSalary,
                    TotalDeduction, NetSalary
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                EmployeeNumber,
                currentMonth,
                grossSalary,
                totalDeduction,
                netSalary
            ]);

            // 4. Get department name
            const [dept] = await db.query(
                'SELECT DepartmentName FROM Department WHERE DepartmentCode = ?',
                [DepartmentCode]
            );

            const departmentName = dept.length ? dept[0].DepartmentName : null;

            // 5. Insert into Report table
            await db.query(`
    INSERT INTO Report (
        EmployeeNumber, FirstName, LastName, Position, DepartmentName, NetSalary
    ) VALUES (?, ?, ?, ?, ?, ?)
`, [
                EmployeeNumber, FirstName, LastName, Position, departmentName, netSalary
            ]);


            // Commit the transaction
            await db.commit();

            return res.status(201).json({
                status: true,
                message: 'Employee added successfully',
                data: {
                    EmployeeNumber,
                    FirstName,
                    LastName,
                    DepartmentCode
                }
            });

        } catch (error) {
            // Rollback in case of error
            await db.rollback();
            throw error;
        }

    } catch (err) {
        console.error('Error adding employee:', err);
        return res.status(500).json({
            status: false,
            message: 'Error adding employee: ' + err.message
        });
    }
});


app.get('/api/reports', isAuthenticated, async (req, res) => {
    try {
        const [reports] = await db.query('SELECT * FROM Report ORDER BY CreatedAt DESC');

        return res.status(200).json({
            status: true,
            data: reports,
            message: reports.length === 0 ? 'No reports found' : 'Reports retrieved successfully'
        });
    } catch (err) {
        console.error('Error fetching reports:', err);
        return res.status(500).json({
            status: false,
            message: 'Error fetching reports'
        });
    }
});





// initialise server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});