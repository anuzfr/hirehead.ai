'use client'
import { useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

export default function ResumeUploadPage() {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

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

        // Simulate upload - replace with your actual upload logic
        setTimeout(() => {
            setUploadStatus('success');
        }, 2000);

        // Example FormData for actual upload:
        // const formData = new FormData();
        // formData.append('resume', file);
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
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
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Upload Your Resume
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload your resume in PDF format to get started
                    </p>
                </div>

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
                                        : uploadStatus === 'success'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {uploadStatus === 'uploading'
                                    ? 'Uploading...'
                                    : uploadStatus === 'success'
                                        ? 'Upload Another'
                                        : 'Upload Resume'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Your resume will be processed securely and confidentially
                    </p>
                </div>
            </div>
        </div>
    );
}