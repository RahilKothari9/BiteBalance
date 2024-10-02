import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserAuth } from '../contexts/AuthContext';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const { user } = UserAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            const firestore = getFirestore();
            const userDoc = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setUserProfile(docSnap.data());
            } else {
                console.log("No Such Documents.");
            }
        };
        fetchUserData();
    }, [user]);

    return (
        <div className="bg-white min-h-screen p-4">
            <div className="max-w-4xl mx-auto pt-20">
                <div className="bg-white shadow rounded-lg p-6">
                    {userProfile && (
                        <>
                            <img src={userProfile.profile_picture} alt={userProfile.name} className='w-32 h-32 rounded-full mb-4' />
                            <h2 className='text-2xl font-semibold text-gray-800'>{userProfile.name}</h2>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;