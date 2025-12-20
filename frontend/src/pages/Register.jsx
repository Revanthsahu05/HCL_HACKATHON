import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PATIENT'); // Default role

    // Doctor Specific State
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const [fees, setFees] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const doctorDetails = role === 'DOCTOR' ? { specialization, experience, fees } : {};

        const res = await register(name, email, password, role, doctorDetails);
        if (res.success) {
            // Redirect based on role
            if (role === 'DOCTOR') navigate('/doctor-dashboard');
            else navigate('/patient-dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                {/* Role Selection Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${role === 'PATIENT'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-blue-200 text-gray-600'
                            }`}
                        onClick={() => setRole('PATIENT')}
                    >
                        <span className="block text-sm">I'm a Patient</span>
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${role === 'DOCTOR'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-blue-200 text-gray-600'
                            }`}
                        onClick={() => setRole('DOCTOR')}
                    >
                        <span className="block text-sm">I'm a Doctor</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Doctor Specific Fields */}
                    {role === 'DOCTOR' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Doctor Details</h3>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Specialization</label>
                                <select
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Orthopedist">Orthopedist</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="5"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Consultation Fees</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg"
                                        value={fees}
                                        onChange={(e) => setFees(e.target.value)}
                                        placeholder="500"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm mt-6">
                        Create {role === 'PATIENT' ? 'Patient' : 'Doctor'} Account
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
                </div>
            </div>
        </div >
    );
};

export default Register;
