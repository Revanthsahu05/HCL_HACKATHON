import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on load
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // MOCK LOGIN LOGIC (No API)
    const login = async (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let userData;
                // Simple logic: If email contains 'doctor', make them a doctor
                if (email.includes('doctor')) {
                    userData = { id: 'doc1', name: 'Dr. House', email, role: 'doctor' };
                } else {
                    userData = { id: 'pat1', name: 'Demo Patient', email, role: 'patient' };
                }

                localStorage.setItem('token', 'mock-jwt-token');
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                resolve({ success: true });
            }, 500); // Simulate network delay
        });
    };

    // MOCK REGISTER LOGIC (No API)
    const register = async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData = { id: 'pat-' + Date.now(), name, email, role: 'patient' };

                localStorage.setItem('token', 'mock-jwt-token');
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                resolve({ success: true });
            }, 500);
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfile = async (updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...user, ...updatedData };
                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
                resolve({ success: true });
            }, 300);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
