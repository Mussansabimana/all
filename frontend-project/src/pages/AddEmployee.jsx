import React, { useState } from 'react';
import { useData } from '../context/AllContext';
import { toast } from 'react-toastify';

const AddEmployee = ({ onClose }) => {
    const { departments, loading, addEmployee } = useData();
    const [formData, setFormData] = useState({
        EmployeeNumber: '',
        FirstName: '',
        LastName: '',
        Position: '',
        Address: '',
        Telephone: '',
        Gender: 'Male',
        HiredDate: '',
        DepartmentCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await addEmployee(formData);
        if (result.success) {
            toast.success('Employee added successfully!');
            onClose();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-back/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Add New Employee</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-pink-200 transition-colors"
                            disabled={loading.addingEmployee}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Employee Number</label>
                                <input
                                    type="text"
                                    name="EmployeeNumber"
                                    value={formData.EmployeeNumber}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">First Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={formData.FirstName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Last Name</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    value={formData.LastName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Position</label>
                                <input
                                    type="text"
                                    name="Position"
                                    value={formData.Position}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Address</label>
                                <input
                                    type="text"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Telephone</label>
                                <input
                                    type="tel"
                                    name="Telephone"
                                    value={formData.Telephone}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Gender</label>
                                <select
                                    name="Gender"
                                    value={formData.Gender}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Hired Date</label>
                                <input
                                    type="date"
                                    name="HiredDate"
                                    value={formData.HiredDate}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">Department</label>
                                <select
                                    name="DepartmentCode"
                                    value={formData.DepartmentCode}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.addingEmployee || loading.departments}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.DepartmentCode} value={dept.DepartmentCode}>
                                            {dept.DepartmentName} - {dept.DepartmentCode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading.addingEmployee}
                                className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading.addingEmployee}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
                            >
                                {loading.addingEmployee ? 'Adding...' : 'Add Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee; 