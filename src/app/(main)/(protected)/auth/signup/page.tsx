import SignUpForm from "@/components/auth/signup-form";
import { Suspense } from "react";

const SignUpPage = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-white p-4 min-h-screen">
            <div className="bg-white shadow-sm mx-auto p-8 border border-gray-100 rounded-lg w-full max-w-md">
                <Suspense fallback={<div className="flex justify-center py-8">Loading...</div>}>
                    <SignUpForm />
                </Suspense>
            </div>
        </div>
    )
};

export default SignUpPage
