"use client";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Briefcase, Users, HelpCircle, User, LogOut, Menu, FileText, Map } from "lucide-react";

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();



    // Helper function to get user route name
    const getUserRouteName = (user) => {
        if (user?.displayName) {
            return user.displayName.toLowerCase().replace(/\s+/g, '-');
        }
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            return emailName.toLowerCase();
        }
        return 'user';
    };

    // Get current active section from pathname
    const getActiveSection = () => {
        const pathSegments = pathname.split('/');
        if (pathSegments.length > 2) {
            return pathSegments[2]; // Get section after username
        }
        return 'home';
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const expectedRoute = getUserRouteName(currentUser);
                if (params.id && params.id !== expectedRoute) {
                    router.replace(`/${expectedRoute}`);
                }
            } else {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router, params.id]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    const menuItems = [
        { id: 'home', label: 'Home', icon: Home, path: '' },
        { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
        { id: 'interview', label: 'Interview', icon: Users, path: '/interview' },
        { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
        { id: 'roadmap', label: 'Roadmaps', icon: Map, path: '/roadmap' },
        { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
    ];

    if (!user) return null;

    const activeSection = getActiveSection();

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-10`}>
                <div className={`p-4 border-b border-gray-200 flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ${sidebarCollapsed ? '' : 'mr-3'}`}
                    >
                        <Menu size={20} className="text-gray-700" />
                    </button>
                    {!sidebarCollapsed && (
                        <Link href="/">
                            <h2 className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors">
                                Hirehead.ai
                            </h2>
                        </Link>
                    )}
                </div>

                <nav className="mt-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const linkPath = `/${params.id}${item.path}`;
                        const isActive = activeSection === item.id;

                        return (
                            <Link
                                key={item.id}
                                href={linkPath}
                                className={`w-full flex items-center ${sidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-left hover:bg-gray-100 transition-colors ${isActive
                                    ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900'
                                    : 'text-gray-700'
                                    }`}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <IconComponent className={sidebarCollapsed ? '' : 'mr-3'} size={20} />
                                {!sidebarCollapsed && item.label}
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${sidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors mt-4`}
                        title={sidebarCollapsed ? 'Logout' : ''}
                    >
                        <LogOut className={sidebarCollapsed ? '' : 'mr-3'} size={20} />
                        {!sidebarCollapsed && 'Logout'}
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
                {children}
            </div>
        </div>
    );
}