import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    useEffect(() => {

        const loadUser = async () => {

            if (!token) return;

            try {

                const user = await authService.me(token);

                setUser(user);

            } catch {

                localStorage.removeItem("token");

                setToken(null);

                setUser(null);

            }

        };

        loadUser();

    }, [token]);
const login = async (email, password) => {

    const data = await authService.login(email, password);

    console.log(data);

    localStorage.setItem(
        "token",
        data.token
    );

    setToken(data.token);

    setUser(data.user);
};

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>

    );
}

export const useAuth = () => useContext(AuthContext);