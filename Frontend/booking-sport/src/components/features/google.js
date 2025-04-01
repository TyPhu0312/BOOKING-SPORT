import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '@/app/firebase/config';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function Enter(props) {
    const user = null;
    const username = null;

    return (
        <main>
            {user ? 
                (!username ? <UsernameForm /> : <SignOutButton />) 
                : <SignInButton />
            }
        </main>
    );
}

function SignInButton() {
    const router = useRouter(); // Initialize navigation

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log("Sign-in successful!");
            alert("Đăng nhập thành công");
            // Navigate to homepage after successful sign-in
            router.push('/');
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    return (
        <Button 
            className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full" 
            variant="outline" 
            onClick={signInWithGoogle}
        >
            <FcGoogle size="25" />
            Đăng nhập với Google
        </Button>
    );
}
