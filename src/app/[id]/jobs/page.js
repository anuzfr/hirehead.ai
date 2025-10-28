"use client";
import { useParams } from "next/navigation";
import { MapPin, Clock, DollarSign } from "lucide-react";

export default function JobsPage() {
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

    const sampleJobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Corp",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$80k - $120k",
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "React Developer",
            company: "StartupXYZ",
            location: "Remote",
            type: "Contract",
            salary: "$70k - $100k",
            posted: "1 week ago"
        },
        {
            id: 3,
            title: "Full Stack Engineer",
            company: "Innovation Labs",
            location: "New York, NY",
            type: "Full-time",
            salary: "$90k - $140k",
            posted: "3 days ago"
        }
    ];

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Opportunities</h1>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Available Positions for {getDisplayName()}</h2>
                    <p className="text-gray-600 mb-6">Browse and apply to job opportunities that match your skills.</p>
                    
                    <div className="space-y-4">
                        {sampleJobs.map((job) => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                                    <span className="text-sm text-gray-500">{job.posted}</span>
                                </div>
                                <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {job.type}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={16} />
                                        {job.salary}
                                    </div>
                                </div>
                                
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}