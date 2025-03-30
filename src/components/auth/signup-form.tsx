/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSignIn, useSignUp } from "@clerk/nextjs";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Icons from "../global/new-icons";

import { toast } from "sonner";
import LoadingIcon from "../ui/loading-icon";
import { OAuthStrategy } from "@clerk/types";
import { FADE_IN_VARIANTS } from '@/constants/animation';
import Image from "next/image";

const SignUpForm = () => {
    const router = useRouter();
    const params = useSearchParams();
    const from = params.get("from");
    const { signIn } = useSignIn();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [isEmailOpen, setIsEmailOpen] = useState<boolean>(true);
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
    const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
    const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false);

    const handleOAuth = async (strategy: OAuthStrategy) => {
        if (strategy === "oauth_google") {
            setIsGoogleLoading(true);
        } else {
            setIsAppleLoading(true);
        }

        try {
            await signIn?.authenticateWithRedirect({
                strategy,
                redirectUrl: "/auth/signup/sso-callback",
                redirectUrlComplete: "/auth/callback",
            });

            toast.loading(`Redirecting to ${strategy === "oauth_google" ? "Google" : "Apple"}...`);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsEmailLoading(true);

        try {
            await signUp.create({
                emailAddress: email,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setIsCodeSent(true);
            toast.success("Verification code sent to your email");
      
        } catch (error: any) {
            switch (error.errors[0]?.code) {
                case "form_identifier_exists":
                    toast.error("This email is already registered. Please sign in.");
                    router.push("/auth/signin?from=signup");
                    break;
                case "form_password_pwned":
                    toast.error("The password is too common. Please choose a stronger password.");
                    break;
                case "form_param_format_invalid":
                    toast.error("Invalid email address. Please enter a valid email address.");
                    break;
                case "form_password_length_too_short":
                    toast.error("Password is too short. Please choose a longer password.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!code) {
            toast.error("Please enter the code");
            return;
        }

        setIsCodeLoading(true);

        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignup.status === "complete") {
                await setActive({ session: completeSignup.createdSessionId });
                router.push("/auth/callback");
            } else {
                console.error(JSON.stringify(completeSignup, null, 2));
                toast.error("Invalid verification code. Please try again.");
            }
        } catch (error) {
            console.error("Error:", JSON.stringify(error, null, 2));
            toast.error("An error occurred. Please try again");
        } finally {
            setIsCodeLoading(false);
        }
    };

    useEffect(() => {
        if (from) {
            setIsEmailOpen(false);
        }
    }, [from]);

    return (
        <div className="flex flex-col w-full font-serif">
            <motion.div
                variants={FADE_IN_VARIANTS}
                animate="visible"
                initial="hidden"
                className="text-center"
            >
                <div className="flex justify-center mb-6">
                <Link href="/">
                        <Image src="/icons/axion-logo.png" alt="logo" width={50} height={50} />
                    </Link>
                </div>
                <h1 className="mb-2 font-semibold text-3xl">
                    {isEmailOpen
                        ? "Create Your Account"
                        : isCodeSent 
                            ? "Verify Your Email" 
                            : "Sign Up to Continue"}
                </h1>
                <p className="mb-6 text-gray-500">
                    {isEmailOpen
                        ? "Get started with your new account"
                        : isCodeSent
                            ? "Please check your inbox for verification code"
                            : "Enter your email address to get started"}
                </p>
            </motion.div>
            
            {isEmailOpen ? (
                <motion.div
                    variants={FADE_IN_VARIANTS}
                    animate="visible"
                    initial="hidden"
                    className="space-y-4"
                >
                    <Button
                        size="lg"
                        type="button"
                        variant="outline"
                        disabled={isGoogleLoading || isAppleLoading}
                        onClick={() => handleOAuth("oauth_google")}
                        className="relative hover:bg-gray-50 py-6 border border-gray-200 w-full font-normal text-gray-700"
                    >
                        {isGoogleLoading ? 
                            <LoadingIcon size="sm" className="left-4 absolute w-5 h-5" /> : 
                            <Icons.google className="left-4 absolute w-5 h-5" />
                        }
                        Continue with Google
                    </Button>
                    
                    <Button
                        size="lg"
                        type="button"
                        variant="outline"
                        disabled={isGoogleLoading || isAppleLoading}
                        onClick={() => handleOAuth("oauth_apple")}
                        className="relative hover:bg-gray-50 py-6 border border-gray-200 w-full font-normal text-gray-700"
                    >
                        {isAppleLoading ? 
                            <LoadingIcon size="sm" className="left-4 absolute w-5 h-5" /> : 
                            <Icons.apple className="left-4 absolute w-5 h-5" />
                        }
                        Continue with Apple
                    </Button>
                    
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-gray-200 border-t"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-gray-200 border-t"></div>
                    </div>
                    
                    <Button
                        size="lg"
                        type="button"
                        variant="default"
                        disabled={isGoogleLoading || isAppleLoading}
                        onClick={() => setIsEmailOpen(false)}
                        className="relative bg-gray-900 hover:bg-black py-6 w-full font-normal"
                    >
                        <MailIcon className="left-4 absolute w-5 h-5" />
                        Continue with Email
                    </Button>
                    
                    <div className="pt-4 text-gray-500 text-sm text-center">
                        Already have an account? <Link href="/auth/signin" className="font-medium text-blue-600 hover:underline">Sign in</Link>
                    </div>
                </motion.div>
            ) : (
                <div>
                    {isCodeSent ? (
                        <motion.form
                            variants={FADE_IN_VARIANTS}
                            animate="visible"
                            initial="hidden"
                            onSubmit={handleVerifyCode}
                            className="space-y-4"
                        >
                            <div className="bg-gray-50 mb-4 p-4 rounded-lg text-gray-600 text-sm">
                                We&apos;ve sent a verification code to <span className="font-medium">{email}</span>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="code" className="font-medium text-gray-700 text-sm">Verification Code</label>
                                <Input
                                    id="code"
                                    autoFocus={true}
                                    name="code"
                                    type="number"
                                    value={code}
                                    disabled={isCodeLoading}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="py-5 border-gray-300 focus:ring-gray-900 w-full"
                                />
                            </div>
                            
                            <Button
                                type="submit"
                                disabled={isCodeLoading}
                                className="relative bg-gray-900 hover:bg-black py-6 w-full font-normal"
                            >
                                {isCodeLoading ? 
                                    <LoadingIcon size="sm" className="mr-2" /> : 
                                    "Verify Code"
                                }
                            </Button>
                            
                            <div className="gap-3 grid grid-cols-2 mt-4">
                                <Button
                                    asChild
                                    type="button"
                                    disabled={isCodeLoading}
                                    variant="outline"
                                    className="hover:bg-gray-50 border-gray-200 font-normal"
                                >
                                    <Link href="https://mail.google.com" target="_blank">
                                        <Icons.gmail className="mr-2 w-4 h-4" />
                                        Open Gmail
                                    </Link>
                                </Button>
                                
                                <Button
                                    asChild
                                    type="button"
                                    disabled={isCodeLoading}
                                    variant="outline"
                                    className="hover:bg-gray-50 border-gray-200 font-normal"
                                >
                                    <Link href="https://outlook.live.com" target="_blank">
                                        <Icons.outlook className="mr-2 w-4 h-4" />
                                        Open Outlook
                                    </Link>
                                </Button>
                            </div>
                            
                            <Button
                                type="button"
                                variant="ghost"
                                disabled={isCodeLoading}
                                onClick={() => setIsEmailOpen(true)}
                                className="hover:bg-gray-50 mt-4 w-full font-normal text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeftIcon className="mr-2 w-3.5 h-3.5" />
                                Back to sign up options
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.form
                            variants={FADE_IN_VARIANTS}
                            animate="visible"
                            initial="hidden"
                            onSubmit={handleEmail}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <label htmlFor="email" className="font-medium text-gray-700 text-sm">Email address</label>
                                <Input
                                    id="email"
                                    autoFocus
                                    name="email"
                                    type="email"
                                    value={email}
                                    disabled={isEmailLoading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="py-5 border-gray-300 focus:ring-gray-900 w-full"
                                />
                            </div>
                            
                            <Button
                                type="submit"
                                disabled={isEmailLoading}
                                className="bg-gray-900 hover:bg-black py-6 w-full font-normal"
                            >
                                {isEmailLoading ? 
                                    <LoadingIcon size="sm" className="mr-2" /> : 
                                    "Continue with Email"
                                }
                            </Button>
                            
                            <Button
                                type="button"
                                variant="ghost"
                                disabled={isEmailLoading}
                                onClick={() => setIsEmailOpen(true)}
                                className="hover:bg-gray-50 w-full font-normal text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeftIcon className="mr-2 w-3.5 h-3.5" />
                                Back to sign up options
                            </Button>
                        </motion.form>
                    )}
                </div>
            )}
        </div>
    )
};

export default SignUpForm
