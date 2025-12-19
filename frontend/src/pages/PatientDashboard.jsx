import { DOCTORS, MY_APPOINTMENTS } from '../data/mockData';
import { useState } from 'react';

const SPECIALIZATIONS = [
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
];

const PatientDashboard = () => {
    const [selectedSpec, setSelectedSpec] = useState(SPECIALIZATIONS[0]);

    const filteredDoctors = DOCTORS.filter(doc => doc.specialization === selectedSpec);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

            {/* UPCOMING APPOINTMENTS */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">My Appointments</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {MY_APPOINTMENTS.length > 0 ? (
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MY_APPOINTMENTS.map(appt => (
                                    <tr key={appt.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{appt.doctorName}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-600 whitespace-no-wrap">{appt.doctorSpecialization}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{appt.date} <br /><span className="text-xs text-gray-500">{appt.time}</span></p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                <span className="relative">{appt.status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-5 text-gray-500">No upcoming appointments.</p>
                    )}
                </div>
            </div>

            {/* FIND DOCTOR */}
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4 md:mb-0">Find a Doctor</h2>

                    {/* Specialization Tabs */}
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
                        <div key={doc.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{doc.specialization}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Slots</h4>
                                <div className="flex flex-wrap gap-2">
                                    {doc.slots.map((slotObj, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!slotObj.available}
                                            className={`px-3 py-1 text-xs rounded border transition-colors ${slotObj.available
                                                ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer'
                                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            onClick={() => {
                                                if (slotObj.available) alert(`Booking initiated for ${doc.name} at ${slotObj.time}`);
                                            }}
                                        >
                                            {slotObj.time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 col-span-3 text-center py-8">No doctors found for this specialization.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
