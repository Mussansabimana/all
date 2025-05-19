import React, { useEffect } from 'react';
import { useData } from '../context/AllContext';

const AllReports = () => {
  const { reports, loading, fetchReports } = useData();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading.reports) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            All Reports
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
          All Reports
        </h2>
        {reports.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <p className="text-white text-lg">No reports found. Please add some reports to the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-4 py-3 text-left text-white font-semibold">Employee</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Position</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Net Salary</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reports.map((report) => (
                  <tr key={report.id} 
                      className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-white">
                      <div className="font-medium">{`${report.FirstName} ${report.LastName}`}</div>
                      <div className="text-white/70 text-sm">{report.EmployeeNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-white">{report.Position}</td>
                    <td className="px-4 py-3 text-white">{report.DepartmentName}</td>
                    <td className="px-4 py-3 text-white">
                      ${parseFloat(report.NetSalary).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {new Date(report.CreatedAt).toLocaleDateString()}
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

export default AllReports;
