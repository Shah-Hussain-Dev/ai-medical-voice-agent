"use client"
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect } from 'react'
export type UserDetails = {
    name: string;
    email: string;
    credits: number;
}
const Provider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useUser();
    const [userDetails, setUserDetails] = React.useState<UserDetails>({
        name: "",
        email: "",
        credits: 0,
    });
    console.log("User Details:", userDetails);
    useEffect(() => {
        if (user) {
            createUser();
        }
    }, [user])
    const createUser = async () => {
        try {
            const response = await axios.post('/api/users');
            const data = response.data;
            console.log("User created:", data);
            setUserDetails(data.user);
        } catch (err) {
            console.error("Error creating user:", err);
        }
    }
    return (
        <div>
            <UserDetailsContext.Provider value={userDetails}>
                {children}
            </UserDetailsContext.Provider>
        </div>
    )
}

export default Provider


