import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">Hospital App</Link>
                <div className="space-x-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                            <Link to="/register" className="text-gray-600 hover:text-blue-500">Register</Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium hidden md:block">{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
