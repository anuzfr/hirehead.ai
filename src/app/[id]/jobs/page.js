"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Clock, DollarSign, Loader2 } from "lucide-react";

export default function JobsPage() {
    const params = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Fetch jobs from API
    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/jobs?query=software developer');
            
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            
            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const formatSalary = (job) => {
        if (job.job_min_salary && job.job_max_salary) {
            return `$${(job.job_min_salary / 1000).toFixed(0)}k - $${(job.job_max_salary / 1000).toFixed(0)}k`;
        }
        return 'Salary not specified';
    };

    const formatPostedDate = (dateString) => {
        const postedDate = new Date(dateString);
        const daysDiff = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) return 'Today';
        if (daysDiff === 1) return '1 day ago';
        if (daysDiff < 7) return `${daysDiff} days ago`;
        if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} week${Math.floor(daysDiff / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(daysDiff / 30)} month${Math.floor(daysDiff / 30) > 1 ? 's' : ''} ago`;
    };



    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Opportunities</h1>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Available Positions for {getDisplayName()}</h2>
                    <p className="text-gray-600 mb-6">Browse and apply to job opportunities that match your skills.</p>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin mr-2" size={24} />
                            <span className="text-gray-600">Loading jobs...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={fetchJobs}
                                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{job.job_title}</h3>
                                        <span className="text-sm text-gray-500">{formatPostedDate(job.job_posted_at_datetime_utc)}</span>
                                    </div>
                                    <p className="text-gray-600 font-medium mb-3">{job.employer_name}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            {job.job_city ? `${job.job_city}${job.job_state ? `, ${job.job_state}` : ''}` : 'Remote'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {job.job_employment_type?.replace('FULLTIME', 'Full-time').replace('CONTRACTOR', 'Contract').replace('INTERN', 'Internship') || 'Full-time'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={16} />
                                            {formatSalary(job)}
                                        </div>
                                    </div>

                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}