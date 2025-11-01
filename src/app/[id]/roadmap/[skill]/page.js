"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    ArrowLeft, CheckCircle, Circle, Clock, Star, MapPin, 
    BookOpen, Code, Play, Award, Target, TrendingUp,
    ChevronRight, ExternalLink, Download, Loader2, AlertCircle,
    Flag, Navigation, Compass, Route
} from "lucide-react";

export default function SkillRoadmapPage() {
    const params = useParams();
    const router = useRouter();
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [roadmapData, setRoadmapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    useEffect(() => {
        const fetchRoadmapData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/roadmap/${params.skill}`);
                const result = await response.json();
                
                if (result.success) {
                    setRoadmapData(result.data);
                    setDataSource(result.source);
                } else {
                    throw new Error(result.error || 'Failed to fetch roadmap data');
                }
            } catch (err) {
                console.error('Error fetching roadmap:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.skill) {
            fetchRoadmapData();
        }
    }, [params.skill]);

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

    // Calculate progress based on fetched data
    const totalSteps = roadmapData ? roadmapData.phases.reduce((acc, phase) => acc + phase.steps.length, 0) : 0;
    const completedCount = completedSteps.size;
    const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    const toggleStepCompletion = (stepId) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Roadmaps</span>
                    </button>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-lg">
                        <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Learning Map</h2>
                        <p className="text-gray-600">Fetching the latest learning path from roadmap.sh...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Roadmaps</span>
                    </button>
                    
                    <div className="bg-white rounded-lg border border-red-200 p-12 text-center shadow-lg">
                        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Map</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!roadmapData) {
        return (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Roadmaps</span>
                    </button>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-lg">
                        <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Map Not Available</h2>
                        <p className="text-gray-600">This learning map is not available at the moment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            {/* Map Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto p-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Roadmaps</span>
                    </button>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                            <div className="flex items-center space-x-3 mb-2">
                                <Compass className="text-blue-600" size={32} />
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {roadmapData.title} Learning Map
                                </h1>
                                {dataSource && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        dataSource === 'roadmap.sh' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {dataSource === 'roadmap.sh' ? '🔗 roadmap.sh' : '📚 Curated'}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-lg mb-3">
                                {roadmapData.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                                    <Clock className="text-gray-500" size={16} />
                                    <span>{roadmapData.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border">
                                    <Target className="text-gray-500" size={16} />
                                    <span>{totalSteps} Learning Stops</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(roadmapData.difficulty)}`}>
                                    {roadmapData.difficulty}
                                </span>
                            </div>
                        </div>
                        
                        {/* Progress Compass */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-2">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-gray-200"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                                        className="text-blue-600 transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{progressPercentage}%</div>
                                        <div className="text-xs text-gray-500">Complete</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {completedCount} of {totalSteps} stops visited
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Map */}
            <div className="relative p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Map Legend */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Navigation className="mr-2" size={18} />
                            Map Legend
                        </h3>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="text-green-500" size={16} />
                                <span>Completed Stop</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Circle className="text-blue-500" size={16} />
                                <span>Available Stop</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Circle className="text-gray-300" size={16} />
                                <span>Future Stop</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Flag className="text-red-500" size={16} />
                                <span>Phase Milestone</span>
                            </div>
                        </div>
                    </div>

                    {/* Learning Path Flowchart */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 overflow-x-auto">
                        {/* Start Node */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 text-white px-10 py-5 rounded-full shadow-xl border-4 border-white">
                                    <div className="flex items-center space-x-3">
                                        <Flag size={24} className="text-yellow-300" />
                                        <div className="font-bold text-lg">Start Learning {roadmapData.title}</div>
                                    </div>
                                </div>
                                {/* Arrow down */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                    <svg width="24" height="40" className="text-indigo-500">
                                        <path d="M12 5 L12 30 M7 25 L12 30 L17 25" stroke="currentColor" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* SVG Definitions for Arrows */}
                        <svg width="0" height="0">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                </marker>
                            </defs>
                        </svg>

                        {/* Learning Phases - Flowchart Style */}
                        <div className="space-y-16 mt-16">
                            {roadmapData.phases.map((phase, phaseIndex) => (
                                <div key={phase.id} className="relative">
                                    {/* Phase Decision Diamond */}
                                    <div className="flex justify-center mb-12">
                                        <div className="relative">
                                            <div className={`w-52 h-26 transform rotate-45 shadow-xl border-4 border-white ${
                                                phaseIndex % 4 === 0 ? 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500' :
                                                phaseIndex % 4 === 1 ? 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500' :
                                                phaseIndex % 4 === 2 ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500' :
                                                'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500'
                                            }`}></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-white font-bold text-center transform -rotate-45 px-4">
                                                    <div className="text-sm">Phase {phaseIndex + 1}</div>
                                                    <div className="text-xs">{phase.title}</div>
                                                </div>
                                            </div>
                                            {/* Arrow down */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                                                <svg width="24" height="40" className="text-indigo-500">
                                                    <path d="M12 5 L12 30 M7 25 L12 30 L17 25" stroke="currentColor" strokeWidth="3" fill="none"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phase Steps in Flowchart Layout */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                        {phase.steps.map((step, stepIndex) => {
                                            const isCompleted = completedSteps.has(step.id);
                                            const isDecision = stepIndex % 3 === 1; // Make every 3rd step a decision diamond
                                            
                                            return (
                                                <div key={step.id} className="relative flex flex-col items-center">
                                                    {/* Step Node */}
                                                    {isDecision ? (
                                                        /* Diamond Decision Node */
                                                        <div 
                                                            className="relative cursor-pointer group"
                                                            onClick={() => toggleStepCompletion(step.id)}
                                                        >
                                                            <div className={`w-36 h-18 transform rotate-45 shadow-xl transition-all duration-300 group-hover:scale-110 border-3 border-white ${
                                                                isCompleted 
                                                                    ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600' 
                                                                    : stepIndex % 3 === 0 
                                                                        ? 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500'
                                                                        : stepIndex % 3 === 1
                                                                            ? 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500'
                                                                            : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600'
                                                            }`}></div>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="text-white font-bold text-center transform -rotate-45 px-2">
                                                                    <div className="text-xs">{step.title.substring(0, 15)}...</div>
                                                                </div>
                                                            </div>
                                                            {/* Completion indicator */}
                                                            <div className="absolute -top-2 -right-2">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                                    isCompleted 
                                                                        ? 'bg-green-500 border-green-600 text-white' 
                                                                        : 'bg-white border-gray-300 text-gray-400'
                                                                }`}>
                                                                    {isCompleted ? (
                                                                        <CheckCircle size={12} />
                                                                    ) : (
                                                                        <Circle size={12} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Rectangular Process Node */
                                                        <div 
                                                            className={`relative border-4 border-white rounded-2xl p-5 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full max-w-sm ${
                                                                isCompleted 
                                                                    ? 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 border-green-400' 
                                                                    : stepIndex % 4 === 0 
                                                                        ? 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 border-blue-400'
                                                                        : stepIndex % 4 === 1
                                                                            ? 'bg-gradient-to-br from-teal-100 via-cyan-50 to-sky-100 border-teal-400'
                                                                            : stepIndex % 4 === 2
                                                                                ? 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 border-orange-400'
                                                                                : 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 border-pink-400'
                                                            }`}
                                                            onClick={() => toggleStepCompletion(step.id)}
                                                        >
                                                            {/* Completion Status */}
                                                            <div className="absolute -top-3 -right-3">
                                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                                                    isCompleted 
                                                                        ? 'bg-green-500 border-green-600 text-white' 
                                                                        : 'bg-white border-gray-300 text-gray-400'
                                                                }`}>
                                                                    {isCompleted ? (
                                                                        <CheckCircle size={16} />
                                                                    ) : (
                                                                        <Circle size={16} />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Step Content */}
                                                            <div className="mb-3">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${
                                                                        isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                                                                        stepIndex % 4 === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 
                                                                        stepIndex % 4 === 1 ? 'bg-gradient-to-r from-teal-500 to-cyan-600' :
                                                                        stepIndex % 4 === 2 ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                                                                        'bg-gradient-to-r from-pink-500 to-rose-600'
                                                                    }`}>
                                                                        {stepIndex + 1}
                                                                    </div>
                                                                    <h4 className="font-semibold text-sm text-gray-800">
                                                                        {step.title}
                                                                    </h4>
                                                                </div>
                                                                <p className="text-gray-600 text-xs mb-2">{step.description}</p>
                                                            </div>

                                                            {/* Step Meta */}
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(step.difficulty)}`}>
                                                                    {step.difficulty}
                                                                </span>
                                                                <div className="flex items-center space-x-1 text-gray-500">
                                                                    <Clock size={12} />
                                                                    <span>{step.duration}</span>
                                                                </div>
                                                            </div>

                                                            {/* Quick Resources */}
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <div className="text-xs text-gray-600">
                                                                    <div className="font-medium mb-1">Resources:</div>
                                                                    <ul className="space-y-1">
                                                                        {step.resources?.slice(0, 2).map((resource, idx) => (
                                                                            <li key={idx} className="truncate">• {resource}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            {/* Action Button */}
                                                            <div className="mt-3">
                                                                <button className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                                                                    isCompleted 
                                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                                                                        : stepIndex % 4 === 0
                                                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                                                                            : stepIndex % 4 === 1
                                                                                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700'
                                                                                : stepIndex % 4 === 2
                                                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700'
                                                                                    : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700'
                                                                }`}>
                                                                    {isCompleted ? 'Review' : 'Start Learning'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Connecting Arrows */}
                                                    {stepIndex < phase.steps.length - 1 && (
                                                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                                            <svg width="35" height="24" className={`${
                                                                isCompleted ? 'text-emerald-500' : 
                                                                stepIndex % 4 === 0 ? 'text-blue-500' :
                                                                stepIndex % 4 === 1 ? 'text-teal-500' :
                                                                stepIndex % 4 === 2 ? 'text-orange-500' : 'text-pink-500'
                                                            }`}>
                                                                <path d="M5 12 L25 12 M20 7 L25 12 L20 17" stroke="currentColor" strokeWidth="3" fill="none"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Connector to Next Phase */}
                                    {phaseIndex < roadmapData.phases.length - 1 && (
                                        <div className="flex justify-center mt-12">
                                            <svg width="24" height="50" className={`${
                                                phaseIndex % 4 === 0 ? 'text-indigo-500' :
                                                phaseIndex % 4 === 1 ? 'text-emerald-500' :
                                                phaseIndex % 4 === 2 ? 'text-orange-500' : 'text-pink-500'
                                            }`}>
                                                <path d="M12 5 L12 40 M7 35 L12 40 L17 35" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Completion Node */}
                        <div className="flex justify-center mt-16">
                            <div className="relative">
                                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-10 py-8 rounded-full shadow-2xl text-center border-4 border-white">
                                    <div className="flex items-center justify-center space-x-3">
                                        <Award size={32} className="text-yellow-200" />
                                        <div>
                                            <div className="font-bold text-xl">Journey Complete!</div>
                                            <div className="text-sm opacity-90">Master of {roadmapData.title}</div>
                                        </div>
                                    </div>
                                </div>
                                {progressPercentage === 100 && (
                                    <div className="mt-6 flex justify-center">
                                        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 flex items-center space-x-3 shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white">
                                            <Download size={20} />
                                            <span>Download Certificate</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}