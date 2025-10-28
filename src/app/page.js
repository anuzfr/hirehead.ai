'use client';

import { useRouter } from 'next/navigation';
import { auth, provider } from '../config/firebase';
import { signInWithPopup } from "firebase/auth";
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  // 🔒 Redirect if user already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/home');
      }
    });
    return unsubscribe;
  }, [router]);

  // 🌐 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('✅ Google login success:', user);
      router.push('/home');
    } catch (error) {
      console.error('❌ Google login failed:', error);
    }
  };



  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <div className="text-center max-w-md">
        <h3 className="text-4xl font-bold font-light mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome to
        </h3>
        <h1 className="text-5xl font-bold font-light mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Hirehead.ai
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Sign in to continue your journey.
        </p>

        {/* 🔵 Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full max-w-sm border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 py-3 px-6">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              width={18}
              height={18}
            />
            <span className="text-gray-800 font-medium">
              Continue with Google
            </span>
          </div>
        </button>


      </div>
    </main>
  );
}
