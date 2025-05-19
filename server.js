// Update salary endpoint
app.put('/api/salaries/update', isAuthenticated, async (req, res) => {
  try {
    const { salaryId, grossSalary } = req.body;

    if (!salaryId || !grossSalary) {
      return res.json({
        status: false,
        message: 'Salary ID and gross salary are required'
      });
    }

    // Calculate deductions
    const taxRate = 0.15; // 15% tax
    const socialSecurityRate = 0.05; // 5% social security
    const healthInsuranceRate = 0.03; // 3% health insurance

    const tax = grossSalary * taxRate;
    const socialSecurity = grossSalary * socialSecurityRate;
    const healthInsurance = grossSalary * healthInsuranceRate;
    const totalDeduction = tax + socialSecurity + healthInsurance;
    const netSalary = grossSalary - totalDeduction;

    // Start a transaction
    await db.beginTransaction();

    try {
      // 1. Get the salary record to update
      const [salary] = await db.query(`
        SELECT s.*, e.FirstName, e.LastName, e.Position, d.DepartmentName
        FROM Salary s
        JOIN Employee e ON s.EmployeeNumber = e.EmployeeNumber
        JOIN Department d ON e.DepartmentCode = d.DepartmentCode
        WHERE s.EmployeeNumber = ? AND s.Month = ?
      `, [salaryId.split('-')[0], salaryId.split('-')[1]]);

      if (!salary.length) {
        throw new Error('Salary record not found');
      }

      // 2. Update the salary record
      await db.query(`
        UPDATE Salary 
        SET GrossSalary = ?,
            TotalDeduction = ?,
            NetSalary = ?
        WHERE EmployeeNumber = ? AND Month = ?
      `, [
        grossSalary,
        totalDeduction,
        netSalary,
        salaryId.split('-')[0],
        salaryId.split('-')[1]
      ]);

      // 3. Update the corresponding report
      await db.query(`
        UPDATE Report 
        SET NetSalary = ?
        WHERE EmployeeNumber = ? AND CreatedAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `, [netSalary, salaryId.split('-')[0]]);

      // Commit the transaction
      await db.commit();

      res.json({
        status: true,
        message: 'Salary updated successfully',
        data: {
          grossSalary,
          totalDeduction,
          netSalary
        }
      });
    } catch (error) {
      // Rollback in case of error
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating salary:', error);
    res.json({
      status: false,
      message: 'Error updating salary: ' + error.message
    });
  }
}); 