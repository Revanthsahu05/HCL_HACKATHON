import { useState, useEffect } from 'react';
import API from '../services/api';

const DoctorDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await API.get('/doctor/appointments/history');
            const formatted = res.data.map(appt => ({
                id: appt._id,
                time: appt.timeSlot,
                patientName: appt.patientId ? appt.patientId.name : 'Unknown',
                status: appt.status || 'BOOKED',
                age: appt.patientId?.age,
                gender: appt.patientId?.gender,
                illnessHistory: 'Details not available'
            }));
            setQueue(formatted);
        } catch (error) {
            console.error('Error fetching queue:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status, notes = null) => {
        try {
            const payload = {};
            if (status) payload.status = status;
            if (notes !== null) payload.notes = notes;

            await API.put(`/doctor/appointments/${id}/status`, payload);
            fetchQueue();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctor Dashboard</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Appointment Queue</h2>
                </div>
                {queue.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No appointments found.</div>
                ) : (
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
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs
                                    ${patient.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-900' : ''}
                                    ${patient.status === 'BOOKED' ? 'bg-blue-100 text-blue-900' : ''}
                                    ${patient.status === 'COMPLETED' ? 'bg-green-100 text-green-900' : ''}
                                    ${patient.status === 'ABSENT' ? 'bg-red-100 text-red-900' : ''}
                                `}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                className="w-full text-xs p-1 border rounded resize-none"
                                                rows="2"
                                                placeholder="Add notes..."
                                                defaultValue={patient.notes || ''}
                                                onBlur={(e) => updateStatus(patient.id, null, e.target.value)}
                                            ></textarea>
                                            <div className="flex gap-1">
                                                <button onClick={() => updateStatus(patient.id, 'IN_PROGRESS')} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">Start</button>
                                                <button onClick={() => updateStatus(patient.id, 'COMPLETED')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Complete</button>
                                                <button onClick={() => updateStatus(patient.id, 'ABSENT')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Absent</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
