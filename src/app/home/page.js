"use client";

import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) setUser(currentUser);
            else router.push("/");
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    if (!user) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl mb-4">Welcome, {user.email}</h1>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}