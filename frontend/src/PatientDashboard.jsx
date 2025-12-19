import { useState, useEffect } from 'react';
import API from '../services/api';

const SPECIALIZATIONS = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedist',
    'Gynecologist',
    'Psychiatrist'
];

const PatientDashboard = () => {
    const [selectedSpec, setSelectedSpec] = useState(SPECIALIZATIONS[0]);
    const [doctors, setDoctors] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctorSlots, setSelectedDoctorSlots] = useState({});

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const docRes = await API.get('/doctors');
            setDoctors(docRes.data);

            const apptRes = await API.get('/appointments/my');
            setMyAppointments(apptRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async (doctorId, date) => {
        try {
            const dateStr = date || selectedDate;
            const res = await API.get(`/doctors/${doctorId}/slots?date=${dateStr}`);

            setSelectedDoctorSlots(prev => ({
                ...prev,
                [doctorId]: res.data
            }));
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const bookAppointment = async (doctorId, date, timeSlot) => {
        try {
            await API.post('/appointments', {
                doctorId,
                date,
                timeSlot
            });
            alert('Appointment Booked Successfully!');
            fetchInitialData();
            fetchSlots(doctorId, date);
        } catch (error) {
            alert(error.response?.data?.message || 'Booking Failed');
        }
    };

    const filteredDoctors = doctors.filter(doc => (doc.specialization || 'General Physician') === selectedSpec);

    const isSlotPassed = (date, timeSlot) => {
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        if (date < todayDate) return true;
        if (date > todayDate) return false;

        const [startHour, startMinute] = timeSlot.split('-')[0].split(':').map(Number);
        const slotTime = new Date(today);
        slotTime.setHours(startHour, startMinute, 0, 0);

        return slotTime < today;
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Upcoming Appointments</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    {myAppointments.filter(appt => ['BOOKED', 'IN_PROGRESS'].includes(appt.status)).length > 0 ? (
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myAppointments.filter(appt => ['BOOKED', 'IN_PROGRESS'].includes(appt.status)).map(appt => (
                                    <tr key={appt._id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{appt.doctorId ? appt.doctorId.name : 'Unknown Doctor'}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-600 whitespace-no-wrap">{appt.doctorId ? (appt.doctorId.specialization || 'N/A') : '-'}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{appt.date} <br /><span className="text-xs text-gray-500">{appt.timeSlot}</span></p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs
                                                ${appt.status === 'BOOKED' ? 'bg-blue-100 text-blue-900' : ''}
                                                ${appt.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-900' : ''}
                                            `}>
                                                {appt.status || 'BOOKED'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs truncate" title={appt.notes}>
                                            <p className="text-gray-900 italic">{appt.notes || '-'}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-5 text-gray-500">No upcoming appointments.</p>
                    )}
                </div>

                <h2 className="text-xl font-semibold mb-4 text-gray-600">Past Appointments</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {myAppointments.filter(appt => ['COMPLETED', 'CANCELLED', 'ABSENT'].includes(appt.status)).length > 0 ? (
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myAppointments.filter(appt => ['COMPLETED', 'CANCELLED', 'ABSENT'].includes(appt.status)).map(appt => (
                                    <tr key={appt._id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{appt.doctorId ? appt.doctorId.name : 'Unknown Doctor'}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-600 whitespace-no-wrap">{appt.doctorId ? (appt.doctorId.specialization || 'N/A') : '-'}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{appt.date} <br /><span className="text-xs text-gray-500">{appt.timeSlot}</span></p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs
                                                ${appt.status === 'COMPLETED' ? 'bg-green-100 text-green-900' : ''}
                                                ${appt.status === 'CANCELLED' ? 'bg-red-100 text-red-900' : ''}
                                                ${appt.status === 'ABSENT' ? 'bg-red-100 text-red-900' : ''}
                                            `}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs truncate" title={appt.notes}>
                                            <p className="text-gray-900 italic">{appt.notes || '-'}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-5 text-gray-500">No past appointments.</p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4 md:mb-0">Find a Doctor</h2>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 font-medium">Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedDoctorSlots({});
                            }}
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6">

                    <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpec(spec)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSpec === spec
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
                        <div key={doc._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{doc.specialization || 'General Physician'}</p>
                                    <p className="text-xs text-gray-500">{doc.experience ? `${doc.experience} Years Exp.` : ''}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 mb-3">
                                <button
                                    onClick={() => fetchSlots(doc._id, selectedDate)}
                                    className="bg-blue-50 text-blue-600 py-1.5 px-4 rounded hover:bg-blue-100 text-sm"
                                >
                                    Check Availability for {selectedDate}
                                </button>
                            </div>

                            {selectedDoctorSlots[doc._id] && (
                                <div className="mt-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Slots for {selectedDate}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDoctorSlots[doc._id].map((slotObj, idx) => {
                                            const isPassed = isSlotPassed(selectedDate, slotObj.timeSlot);
                                            const isFree = slotObj.status === 'FREE';
                                            const disabled = !isFree || isPassed;

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={disabled}
                                                    className={`px-3 py-1 text-xs rounded border transition-colors ${!isFree
                                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : isPassed
                                                            ? 'bg-red-50 border-red-100 text-red-300 cursor-not-allowed line-through'
                                                            : 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer'
                                                        }`}
                                                    onClick={() => !disabled && bookAppointment(doc._id, selectedDate, slotObj.timeSlot)}
                                                    title={isPassed ? 'Slot time has passed' : slotObj.status}
                                                >
                                                    {slotObj.timeSlot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg mb-2">No doctors found for this specialization.</p>
                            <p className="text-sm text-gray-400">Try selecting a different specialization or check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
