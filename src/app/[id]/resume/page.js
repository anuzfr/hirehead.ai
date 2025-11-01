'use client'
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, FileText, X, CheckCircle, AlertCircle, BarChart3, TrendingUp, TrendingDown, Star, Target, Zap, Eye } from 'lucide-react';

export default function ResumeUploadPage() {
    const params = useParams();
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, analyzing, success, error
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            setUploadStatus('idle');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setUploadStatus('idle');
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setUploadStatus('idle');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploadStatus('uploading');
        setError(null);

        try {
            // First upload and then analyze
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('userId', params.id);

            const response = await fetch('/api/resume/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to analyze resume');
            }

            const result = await response.json();
            setAnalysis(result);
            setUploadStatus('success');
        } catch (err) {
            console.error('Resume analysis error:', err);
            setError(err.message);
            setUploadStatus('error');
        }
    };

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

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const resetAnalysis = () => {
        setFile(null);
        setAnalysis(null);
        setUploadStatus('idle');
        setError(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Resume Analysis for {getDisplayName()}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload your resume to get ATS score and improvement suggestions
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                }`}
                        >
                            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Drop your resume here
                            </h3>
                            <p className="text-gray-600 mb-6">
                                or click to browse from your computer
                            </p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <span className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors duration-200 inline-block">
                                    Choose PDF File
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-4">
                                Supported format: PDF (Max 10MB)
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <FileText className="h-10 w-10 text-indigo-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                    disabled={uploadStatus === 'uploading'}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {uploadStatus === 'success' && (
                                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <p className="text-green-800 font-medium">
                                        Resume uploaded successfully!
                                    </p>
                                </div>
                            )}

                            {uploadStatus === 'error' && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-800 font-medium">
                                        Upload failed. Please try again.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={uploadStatus === 'uploading'}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${uploadStatus === 'uploading'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {uploadStatus === 'uploading'
                                    ? 'Analyzing Resume...'
                                    : 'Analyze Resume'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Analysis Results */}
                {analysis && uploadStatus === 'success' && (
                    <div className="mt-8 space-y-6">
                        {/* ATS Score Overview */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">ATS Score Analysis</h2>
                                    {analysis.dataSource && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            analysis.dataSource === 'Real Content Analysis' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {analysis.dataSource === 'Real Content Analysis' ? '🔍 Real Analysis' : '🔧 Demo Mode'}
                                        </span>
                                    )}
                                </div>
                                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(analysis.atsScore)} mb-4`}>
                                    <span className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                                        {analysis.atsScore}%
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    {analysis.atsScore >= 80 ? 'Excellent! Your resume is ATS-friendly.' :
                                     analysis.atsScore >= 60 ? 'Good, but there\'s room for improvement.' :
                                     'Needs significant improvement for ATS compatibility.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <BarChart3 className="mx-auto text-blue-600 mb-2" size={24} />
                                    <h3 className="font-semibold text-blue-800">Format Score</h3>
                                    <p className="text-2xl font-bold text-blue-600">{analysis.formatScore}%</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Target className="mx-auto text-green-600 mb-2" size={24} />
                                    <h3 className="font-semibold text-green-800">Content Score</h3>
                                    <p className="text-2xl font-bold text-green-600">{analysis.contentScore}%</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <Zap className="mx-auto text-purple-600 mb-2" size={24} />
                                    <h3 className="font-semibold text-purple-800">Keywords Score</h3>
                                    <p className="text-2xl font-bold text-purple-600">{analysis.keywordScore}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Strengths */}
                        {analysis.strengths && analysis.strengths.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <TrendingUp className="text-green-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Strengths</h3>
                                </div>
                                <div className="space-y-3">
                                    {analysis.strengths.map((strength, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="text-green-600 mt-0.5" size={16} />
                                            <p className="text-green-800">{strength}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Areas for Improvement */}
                        {analysis.improvements && analysis.improvements.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <TrendingDown className="text-orange-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Areas for Improvement</h3>
                                </div>
                                <div className="space-y-3">
                                    {analysis.improvements.map((improvement, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                                            <AlertCircle className="text-orange-600 mt-0.5" size={16} />
                                            <p className="text-orange-800">{improvement}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Star className="text-blue-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Recommendations</h3>
                                </div>
                                <div className="space-y-3">
                                    {analysis.recommendations.map((recommendation, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                            <Eye className="text-blue-600 mt-0.5" size={16} />
                                            <p className="text-blue-800">{recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detailed Analysis */}
                        {analysis.detailedAnalysis && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <BarChart3 className="text-indigo-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Detailed Analysis</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Info Analysis */}
                                    {analysis.detailedAnalysis.contactInfo && (
                                        <div className="p-4 bg-indigo-50 rounded-lg">
                                            <h4 className="font-semibold text-indigo-800 mb-2">Contact Information</h4>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-indigo-700">Completeness Score</span>
                                                <span className="font-bold text-indigo-800">{analysis.detailedAnalysis.contactInfo.score}%</span>
                                            </div>
                                            <p className="text-sm text-indigo-700">{analysis.detailedAnalysis.contactInfo.feedback}</p>
                                        </div>
                                    )}
                                    
                                    {/* Skills Analysis */}
                                    {analysis.detailedAnalysis.skillsAnalysis && (
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-2">Skills Assessment</h4>
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-green-700">Technical Skills</span>
                                                    <span className="font-medium text-green-800">{analysis.detailedAnalysis.skillsAnalysis.technicalCount}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-green-700">Soft Skills</span>
                                                    <span className="font-medium text-green-800">{analysis.detailedAnalysis.skillsAnalysis.softCount}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-green-700">{analysis.detailedAnalysis.skillsAnalysis.feedback}</p>
                                        </div>
                                    )}
                                    
                                    {/* Experience Analysis */}
                                    {analysis.detailedAnalysis.experienceDepth && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-blue-800 mb-2">Experience Depth</h4>
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Experience Keywords</span>
                                                    <span className="font-medium text-blue-800">{analysis.detailedAnalysis.experienceDepth.keywordCount}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Quantifiable Results</span>
                                                    <span className="font-medium text-blue-800">{analysis.detailedAnalysis.experienceDepth.hasQuantifiableResults ? 'Yes' : 'No'}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-blue-700">{analysis.detailedAnalysis.experienceDepth.feedback}</p>
                                        </div>
                                    )}
                                    
                                    {/* Professional Presentation */}
                                    {analysis.detailedAnalysis.professionalPresentation && (
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <h4 className="font-semibold text-purple-800 mb-2">Professional Presentation</h4>
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Word Count</span>
                                                    <span className="font-medium text-purple-800">{analysis.detailedAnalysis.professionalPresentation.wordCount}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Has Summary</span>
                                                    <span className="font-medium text-purple-800">{analysis.detailedAnalysis.professionalPresentation.hasStructure ? 'Yes' : 'No'}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-purple-700">{analysis.detailedAnalysis.professionalPresentation.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Industry Insights */}
                        {analysis.industryInsights && analysis.industryInsights.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <TrendingUp className="text-emerald-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Industry Insights</h3>
                                </div>
                                <div className="space-y-4">
                                    {analysis.industryInsights.map((insight, index) => (
                                        <div key={index} className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-emerald-800">{insight.category}</h4>
                                                <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">Insight</span>
                                            </div>
                                            <p className="text-emerald-700 mb-2">{insight.insight}</p>
                                            <p className="text-sm text-emerald-600 font-medium">💡 {insight.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={resetAnalysis}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Analyze Another Resume
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Print Report
                            </button>
                        </div>
                    </div>
                )}

                {!analysis && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Your resume will be analyzed securely using AI-powered ATS scoring
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}