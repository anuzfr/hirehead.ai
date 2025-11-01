"use client";
import { useParams } from "next/navigation";

export default function DashboardPage() {
    const params = useParams();

    // Get display name from URL parameter
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

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {getDisplayName()}</h1>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                        <p className="text-gray-600">This is your home dashboard. Navigate using the sidebar to access different features.</p>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}