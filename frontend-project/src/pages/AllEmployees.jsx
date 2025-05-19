import React, { useState, useEffect } from 'react';
import { useData } from '../context/AllContext';
import AddEmployee from './AddEmployee';

const AllEmployees = () => {
  const { employees, loading, fetchEmployees } = useData();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading.employees) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            All Employees
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            All Employees
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-lg backdrop-blur-md transition-all duration-200 font-semibold"
          >
            Add New Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <p className="text-white text-lg">No employees found. Please add some employees to the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-4 py-3 text-left text-white font-semibold">Employee Number</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Position</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Hired Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {employees.map((employee) => (
                  <tr key={employee.EmployeeNumber} 
                      className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-white">{employee.EmployeeNumber}</td>
                    <td className="px-4 py-3 text-white">
                      {employee.FirstName} {employee.LastName}
                    </td>
                    <td className="px-4 py-3 text-white">{employee.Position}</td>
                    <td className="px-4 py-3 text-white">{employee.DepartmentName}</td>
                    <td className="px-4 py-3 text-white">
                      <div>{employee.Telephone}</div>
                      <div className="text-white/70 text-sm">{employee.Address}</div>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {new Date(employee.HiredDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEmployee onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default AllEmployees;
