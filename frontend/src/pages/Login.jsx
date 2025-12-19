import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            // Redirect based on role? Or let AuthContext/App decide. 
            // For now, simple redirect.
            // But we don't have user object instantly updated in local scope maybe?
            // Actually try to read from localstorage or just navigate
            // Best practice: rely on state update, but here we can just check role from storage or wait.
            // Let's navigation to home, and App will redirect to dashboard if logged in?
            // Actually, let's redirect to specific dashboards.
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'doctor') navigate('/doctor-dashboard');
            else navigate('/patient-dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

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
                    <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register (Patient)</Link></p>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 text-xs text-yellow-800 rounded border border-yellow-200">
                    <p><strong>Demo Creds:</strong></p>
                    <p>Doctor: doctor@hospital.com / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
