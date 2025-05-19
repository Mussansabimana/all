import React, { useState, useEffect } from 'react';
import { useData } from '../context/AllContext';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSalary } from '../services/api';
import { toast } from 'react-toastify';

const UpdateSalary = () => {
  const { salaries, loading, fetchSalaries } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [newGrossSalary, setNewGrossSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && salaries) {
      const salary = salaries.find(s => s.id === parseInt(id));
      if (salary) {
        setSelectedSalary(salary);
        setNewGrossSalary(salary.GrossSalary);
      }
    }
  }, [id, salaries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateSalary({
        salaryId: selectedSalary.id,
        grossSalary: parseFloat(newGrossSalary)
      });

      if (response.data.status) {
        toast.success('Salary updated successfully');
        await fetchSalaries(); // Refresh the salaries list
        setTimeout(() => {
          navigate('/dashboard/all-salaries');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to update salary');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating salary');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.salaries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Update Salary
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg mt-4">Loading salary information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSalary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Update Salary
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center shadow-xl">
            <p className="text-white text-lg">Salary record not found.</p>
            <button
              onClick={() => navigate('/dashboard/all-salaries')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Back to Salaries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
          Update Salary
        </h2>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Employee
              </label>
              <p className="text-white/90">
                {selectedSalary.FirstName} {selectedSalary.LastName}
              </p>
              <p className="text-white/70 text-sm">{selectedSalary.EmployeeNumber}</p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Department
              </label>
              <p className="text-white/90">{selectedSalary.DepartmentName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Current Gross Salary
              </label>
              <p className="text-white/90">${parseFloat(selectedSalary.GrossSalary).toFixed(2)}</p>
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2">
                New Gross Salary
              </label>
              <input
                type="number"
                value={newGrossSalary}
                onChange={(e) => setNewGrossSalary(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                required
                min="0"
                step="0.01"
                placeholder="Enter new gross salary"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/all-salaries')}
                className="px-4 py-2 text-white hover:text-white/80 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Salary'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalary;
