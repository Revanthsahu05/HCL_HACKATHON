import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        illnessHistory: '',
        specialization: '',
        experience: '',
        isAvailable: true // For doctors
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',
                illnessHistory: user.illnessHistory || '',
                specialization: user.specialization || '',
                experience: user.experience || '',
                isAvailable: user.isAvailable !== undefined ? user.isAvailable : true
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const res = await updateProfile(formData);
        if (res.success) {
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Profile ({user.role === 'doctor' ? 'Doctor' : 'Patient'})</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Common Fields */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={true} // Email usually styling immutable or complex to change
                                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Patient Specific */}
                        {user.role === 'patient' && (
                            <>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1">Medical History / Illness</label>
                                    <textarea
                                        name="illnessHistory"
                                        value={formData.illnessHistory}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="3"
                                        className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
                                    />
                                </div>
                            </>
                        )}

                        {/* Doctor Specific */}
                        {user.role === 'doctor' && (
                            <>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Specialization</label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
                                    >
                                        <option value="">Select Specialization</option>
                                        <option value="General Physician">General Physician</option>
                                        <option value="Gynecologist">Gynecologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Neurologist">Neurologist</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Experience (Years)</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
