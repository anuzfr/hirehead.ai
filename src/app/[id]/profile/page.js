'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "../../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User, Mail, Calendar, MapPin } from "lucide-react";

export default function ProfilePage() {
    const params = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const getDisplayName = () => {
        if (params.id) {
            const urlName = params.id.toString();
            if (urlName.includes('-')) {
                return urlName.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
            }
            return urlName.charAt(0).toUpperCase() + urlName.slice(1);
        }
        return 'User';
    };

    if (!user) return null;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-6">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full" />
                            ) : (
                                <User size={40} className="text-gray-500" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">{getDisplayName()}</h2>
                            <p className="text-gray-600">Software Developer</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-800">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="text-gray-800">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <User className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Display Name</p>
                                    <p className="text-gray-800">{user.displayName || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <MapPin className="text-gray-500" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="text-gray-800">Not specified</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}