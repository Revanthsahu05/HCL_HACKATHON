import { useState } from 'react';
import { INITIAL_QUEUE } from '../data/mockData';

const DoctorDashboard = () => {
    const [queue, setQueue] = useState(INITIAL_QUEUE);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const updateStatus = (id, newStatus) => {
        setQueue(queue.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctor Dashboard</h1>

            {/* QUEUE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Today's Queue</h2>
                </div>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.map(patient => (
                            <tr key={patient.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{patient.time}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-medium">{patient.patientName}</p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedPatient(patient);
                                        }}
                                        className="text-xs text-blue-500 hover:text-blue-700 underline mt-1 cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs
                                        ${patient.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-900' : ''}
                                        ${patient.status === 'WAITING' ? 'bg-blue-100 text-blue-900' : ''}
                                        ${patient.status === 'COMPLETED' ? 'bg-green-100 text-green-900' : ''}
                                        ${patient.status === 'ABSENT' ? 'bg-red-100 text-red-900' : ''}
                                    `}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => updateStatus(patient.id, 'IN_PROGRESS')}
                                            className="text-xs bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                                        >
                                            Start
                                        </button>
                                        <button
                                            onClick={() => updateStatus(patient.id, 'COMPLETED')}
                                            className="text-xs bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => updateStatus(patient.id, 'ABSENT')}
                                            className="text-xs bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PATIENT DETAILS MODAL */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background Overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setSelectedPatient(null)}
                        ></div>

                        {/* Modal Panel */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-xl leading-6 font-medium text-gray-900 border-b pb-2 mb-4">
                                            Patient Details
                                        </h3>
                                        <div className="mt-2 space-y-3">
                                            <div>
                                                <span className="text-sm font-bold text-gray-500 uppercase">Name</span>
                                                <p className="text-lg font-semibold text-gray-800">{selectedPatient.patientName}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-sm font-bold text-gray-500 uppercase">Age</span>
                                                    <p className="text-md text-gray-800">{selectedPatient.age || 'N/A'} Years</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-gray-500 uppercase">Gender</span>
                                                    <p className="text-md text-gray-800">{selectedPatient.gender || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-500 uppercase">Illness / Symptoms</span>
                                                <p className="text-md text-gray-800 bg-red-50 p-2 rounded border border-red-100">
                                                    {selectedPatient.illnessHistory || 'No history recorded'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setSelectedPatient(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
