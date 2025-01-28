import React, { createContext, useState } from "react";
import user from "../service/Auth"; // Service untuk pemanggilan API

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userdata, setUserdata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi untuk memanggil API dan menyimpan data
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await user.get("/user/listDaftarUser");
            setUserdata(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data dari server");
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                userdata,
                loading,
                error,
                fetchUserData, // Fungsi untuk dipanggil saat menu diklik
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
