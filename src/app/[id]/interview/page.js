"use client";
import { useParams } from "next/navigation";

export default function InterviewPage() {
    const params = useParams();

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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Interview Preparation</h1>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Practice Interviews</h2>
                    <p className="text-gray-600 mb-6">Start your interview preparation here, {getDisplayName()}. Practice with AI-powered mock interviews.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Technical Interview</h3>
                            <p className="text-gray-600 text-sm mb-4">Practice coding problems and technical questions</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Start Practice
                            </button>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Behavioral Interview</h3>
                            <p className="text-gray-600 text-sm mb-4">Practice common behavioral questions</p>
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                                Start Practice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}