import React, { useEffect } from 'react';
import { useData } from '../context/AllContext';

const AllDepartments = () => {
  const { departments, loading, fetchDepartments } = useData();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (loading.departments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            All Departments
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4">Loading departments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
          All Departments
        </h2>
        {departments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <p className="text-white text-lg">No departments found. Please add some departments to the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-4 py-3 text-left text-white font-semibold">Department Code</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Department Name</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Gross Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {departments.map((department) => (
                  <tr key={department.DepartmentCode} 
                      className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-white">{department.DepartmentCode}</td>
                    <td className="px-4 py-3 text-white">{department.DepartmentName}</td>
                    <td className="px-4 py-3 text-white">
                      ${parseFloat(department.GrossSalary).toFixed(2)}
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

export default AllDepartments;
