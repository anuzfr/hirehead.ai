import { NextResponse } from 'next/server';
import { db } from '../../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const docRef = doc(db, 'userProfiles', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return NextResponse.json({
                success: true,
                data: docSnap.data()
            });
        } else {
            return NextResponse.json({
                success: true,
                data: null,
                message: 'Profile not found'
            });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, profileData } = body;

        if (!userId || !profileData) {
            return NextResponse.json(
                { error: 'User ID and profile data are required' },
                { status: 400 }
            );
        }

        // Validate profile data structure
        const validatedData = {
            displayName: profileData.displayName || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            dateOfBirth: profileData.dateOfBirth || '',
            location: profileData.location || '',
            profileSummary: profileData.profileSummary || '',
            skills: Array.isArray(profileData.skills) ? profileData.skills : [],
            education: Array.isArray(profileData.education) ? profileData.education : [],
            certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
            socialLinks: {
                linkedin: profileData.socialLinks?.linkedin || '',
                github: profileData.socialLinks?.github || '',
                website: profileData.socialLinks?.website || ''
            },
            updatedAt: new Date().toISOString(),
            userId: userId
        };

        const docRef = doc(db, 'userProfiles', userId);
        await setDoc(docRef, validatedData, { merge: true });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: validatedData
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}