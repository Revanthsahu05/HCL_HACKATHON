import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <h1 className="text-4xl font-bold text-blue-800 mb-6">Hospital Appointment System</h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl text-center">
                Welcome to our modern hospital management portal. Book appointments easily or manage your schedule efficiently.
            </p>
            <div className="flex space-x-6">
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    Login
                </Link>
                <Link to="/register" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow hover:bg-gray-50 transition">
                    Register as Patient
                </Link>
            </div>
        </div>
    );
};

export default Home;
