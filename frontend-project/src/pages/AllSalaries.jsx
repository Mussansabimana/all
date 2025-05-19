import React from 'react';
import { useData } from '../context/AllContext';
import { useNavigate } from 'react-router-dom';

const AllSalaries = () => {
  const { salaries, loading, fetchSalaries } = useData();
  const navigate = useNavigate();

  if (loading.salaries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            All Salaries
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4">Loading salaries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
          All Salaries
        </h2>
        {!salaries || salaries.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <p className="text-white text-lg">No salary records found. Please add some salaries to the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-4 py-3 text-left text-white font-semibold">Employee</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Gross Salary</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Total Deduction</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Net Salary</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Month</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {salaries.map((salary) => (
                  <tr key={salary.id} 
                      className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-white">
                      <div className="font-medium">{`${salary.FirstName} ${salary.LastName}`}</div>
                      <div className="text-white/70 text-sm">{salary.EmployeeNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-white">{salary.DepartmentName}</td>
                    <td className="px-4 py-3 text-white">
                      ${parseFloat(salary.GrossSalary).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ${parseFloat(salary.TotalDeduction).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ${parseFloat(salary.NetSalary).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-white">{salary.Month}</td>
                    <td className="px-4 py-3 text-white">
                      <button
                        onClick={() => navigate(`/dashboard/update-salary/${salary.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSalaries;
