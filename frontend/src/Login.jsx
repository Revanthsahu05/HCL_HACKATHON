import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('PATIENT'); // 'PATIENT' or 'DOCTOR'
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);

        if (res.success) {
            // Check if the role matches the active tab
            // We need to retrieve the user data. logic below is from the previous file content
            // but we need to verify the user role against the activeTab.

            // Note: login() in AuthContext sets localStorage. We can read it or use the returned success to assume it's set.
            const user = JSON.parse(localStorage.getItem('user'));

            // Enforce Role Check
            if (activeTab === 'DOCTOR' && user.role !== 'DOCTOR') {
                setError('Access Denied: This account is not registered as a Doctor.');
                // Optional: Logout to clear the wrong session
                return;
            }
            if (activeTab === 'PATIENT' && user.role !== 'PATIENT') {
                setError('Access Denied: Please login via the Doctor portal.');
                return;
            }

            if (user?.role === 'DOCTOR') navigate('/doctor-dashboard');
            else navigate('/patient-dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {activeTab === 'DOCTOR' ? 'Doctor Login' : 'Patient Login'}
                </h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                {/* Role Toggle Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${activeTab === 'PATIENT'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-blue-200 text-gray-600'
                            }`}
                        onClick={() => setActiveTab('PATIENT')}
                    >
                        <span className="block text-sm">Patient</span>
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${activeTab === 'DOCTOR'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-blue-200 text-gray-600'
                            }`}
                        onClick={() => setActiveTab('DOCTOR')}
                    >
                        <span className="block text-sm">Doctor</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 border rounded focus:ring focus:ring-blue-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-2 border rounded focus:ring focus:ring-blue-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
                </div>

            </div>
        </div>
    );
};

export default Login;
