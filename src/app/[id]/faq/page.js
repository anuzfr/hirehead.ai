"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
    const params = useParams();
    const [openItems, setOpenItems] = useState({});

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

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const faqs = [
        {
            question: "How do I upload my resume?",
            answer: "Navigate to the Resume section in the sidebar and drag & drop your PDF file or click to browse and select your resume file."
        },
        {
            question: "What types of interviews can I practice?",
            answer: "You can practice both technical interviews (coding problems, system design) and behavioral interviews (situational questions, soft skills)."
        },
        {
            question: "How are job recommendations generated?",
            answer: "Our AI analyzes your resume, skills, and preferences to match you with relevant job opportunities from our partner companies."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use industry-standard encryption and security measures to protect your personal information and resume data."
        },
        {
            question: "Can I edit my profile information?",
            answer: "Yes, you can update your profile information, skills, and preferences in the My Profile section."
        },
        {
            question: "How do I get interview feedback?",
            answer: "After completing practice interviews, you'll receive detailed feedback on your performance, including areas for improvement."
        }
    ];

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
                    <p className="text-gray-600 mb-6">Find answers to commonly asked questions about our platform, {getDisplayName()}.</p>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-800">{faq.question}</span>
                                    {openItems[index] ? (
                                        <ChevronUp className="text-gray-500" size={20} />
                                    ) : (
                                        <ChevronDown className="text-gray-500" size={20} />
                                    )}
                                </button>
                                {openItems[index] && (
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}