"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import { SignInButton, SignUpButton, useAuth, useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const clerk = useClerk();
  const { setActive } = clerk;

  const isAuthReady = isLoaded || clerk?.loaded;
  const activeSignUp = signUp || clerk?.client?.signUp;
  const activeSignIn = signIn || clerk?.client?.signIn;
  const activeSetActive = setActive || clerk?.setActive;
  
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: enter email, 1: enter code and new password
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebugMsg("handleAuth triggered...");
    setIsLoading(true);

    // Wait up to 2.5s if Clerk is still initializing
    let readySignUp = signUp || clerk?.client?.signUp;
    let readySignIn = signIn || clerk?.client?.signIn;
    if (!clerk?.loaded && !isLoaded) {
      for (let i = 0; i < 10; i++) {
        await new Promise((res) => setTimeout(res, 250));
        readySignUp = signUp || clerk?.client?.signUp;
        readySignIn = signIn || clerk?.client?.signIn;
        if (clerk?.loaded || isLoaded) break;
      }
    }

    if (isLogin) {
      const currentSignIn = readySignIn || clerk?.client?.signIn;
      if (!currentSignIn) {
        setError("Authentication service is initializing, please wait a moment.");
        setIsLoading(false);
        return;
      }
      if (!email.trim() || !password) {
        setError("Please enter both email and password.");
        setIsLoading(false);
        return;
      }
      setDebugMsg("Mode: Login. Calling currentSignIn.create...");
      try {
        setDebugMsg("Calling currentSignIn.create...");
        const result = await currentSignIn.create({
          identifier: email.trim(),
          password,
        });

        const status = result?.status || currentSignIn.status;
        const sessionId = result?.createdSessionId || currentSignIn.createdSessionId;

        if (status === "complete") {
          setDebugMsg("SignIn complete. Setting active session...");
          await activeSetActive({ session: sessionId });
          router.push("/dashboard");
        } else {
          setDebugMsg("SignIn incomplete: " + JSON.stringify(result));
          console.log("SignIn Result:", result, "signIn obj:", currentSignIn);
          
          // Check if it's an error object returned directly
          if (result && (result as any).error) {
            const actualErrors = (result as any).error.errors || [];
            const firstErr = actualErrors[0] || (result as any).error;
            
            if (firstErr.code === "strategy_for_user_invalid") {
              setError("This account is linked to Google. Please use the Google button to log in. Password login is disabled for social accounts.");
            } else if (firstErr.code === "form_password_incorrect") {
              setError("Incorrect password. If you just reset it, please make sure you typed it correctly.");
            } else {
              setError(firstErr.longMessage || firstErr.message || "Login incomplete. Please try again.");
            }
          } else {
            setError(`Login incomplete. Status: ${status}. Additional verification might be required.`);
          }
          
          setIsLoading(false);
        }
      } catch (err: any) {
        setDebugMsg("SignIn error caught.");
        console.error("SignIn Error:", err);
        setError(err.errors?.[0]?.longMessage || err.message || "Error logging in");
        setIsLoading(false);
      }
    } else {
      const currentSignUp = readySignUp || clerk?.client?.signUp;
      if (!currentSignUp) {
        setError("Authentication service is initializing, please wait a moment.");
        setIsLoading(false);
        return;
      }
      if (!email.trim() || !password || !fullName.trim()) {
        setError("Please enter your full name, email, and password.");
        setIsLoading(false);
        return;
      }
      setDebugMsg("Mode: Register. Calling currentSignUp.create...");
      try {
        setDebugMsg("Calling currentSignUp.create...");
        
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        const result = await currentSignUp.create({
          firstName,
          lastName,
          emailAddress: email.trim(),
          password,
        });
        
        // Handle Clerk Future API where errors are returned instead of thrown
        if (result && (result as any).error) {
          throw (result as any).error;
        }

        setDebugMsg("Calling prepareEmailAddressVerification...");
        console.log("AVAILABLE METHODS ON currentSignUp:", Object.keys(currentSignUp));
        
        let sendResult;
        if (result && typeof (result as any).sendEmailCode === 'function') {
          sendResult = await (result as any).sendEmailCode();
        } else if (typeof currentSignUp.sendEmailCode === 'function') {
          sendResult = await currentSignUp.sendEmailCode();
        } else if (typeof currentSignUp.prepareEmailAddressVerification === 'function') {
          sendResult = await currentSignUp.prepareEmailAddressVerification({ strategy: "email_code" });
        } else if (typeof currentSignUp.prepareVerification === 'function') {
          sendResult = await currentSignUp.prepareVerification({ strategy: "email_code" });
        } else {
          throw new Error("No verification method found! Please make sure Clerk SDK is correctly configured.");
        }
        
        // Check if sendEmailCode returned an error
        if (sendResult && (sendResult as any).error) {
          throw (sendResult as any).error;
        }

        setDebugMsg("Verification prepared. Setting pendingVerification=true.");
        setPendingVerification(true);
        setIsLoading(false);
      } catch (err: any) {
        setDebugMsg("SignUp error caught: " + (err.errors?.[0]?.longMessage || err.message));
        console.error("SignUp Error:", err);
        
        let errorMessage = err.errors?.[0]?.longMessage || err.message || "Error signing up";
        if (err.errors?.[0]?.code === 'form_identifier_exists' || errorMessage.includes('email address is taken')) {
          errorMessage = "You already have an account with this email. Please login instead.";
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const currentSignUp = signUp || clerk?.client?.signUp;
      if (!currentSignUp) throw new Error("Sign up session not found. Please try signing up again.");

      let completeSignUp;
      if (typeof currentSignUp.verifyEmailCode === 'function') {
        completeSignUp = await currentSignUp.verifyEmailCode({ code });
      } else if (typeof currentSignUp.attemptEmailAddressVerification === 'function') {
        completeSignUp = await currentSignUp.attemptEmailAddressVerification({ code });
      } else if (typeof currentSignUp.attemptVerification === 'function') {
        completeSignUp = await currentSignUp.attemptVerification({ strategy: "email_code", code });
      } else {
        throw new Error("No attemptVerification method found on signUp object!");
      }
      
      const status = completeSignUp?.status || currentSignUp.status;
      const createdSessionId = completeSignUp?.createdSessionId || currentSignUp.createdSessionId;

      if (status === 'complete') {
        await activeSetActive({ session: createdSessionId });
        router.push("/dashboard");
      } else {
        setDebugMsg("Verify incomplete: " + JSON.stringify(completeSignUp || currentSignUp));
        setError("Verification incomplete. Status: " + status);
      }
    } catch (err: any) {
      console.error("Verify Error:", err);
      setError(err.errors?.[0]?.longMessage || err.message || "Error verifying code");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const currentSignIn = signIn || clerk?.client?.signIn;
      if (!currentSignIn) throw new Error("Authentication service is initializing, please wait a moment.");

      if (forgotPasswordStep === 0) {
        // Step 1: Request reset code
        await currentSignIn.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        });
        setForgotPasswordStep(1);
        setError(""); // Clear any previous errors
      } else {
        // Step 2: Submit code and new password
        let result;
        let methodUsed = '';
        
        try {
          if (typeof currentSignIn.verifyResetPasswordEmailCode === 'function' && typeof currentSignIn.submitResetPassword === 'function') {
            methodUsed = 'verify+submit (2-step)';
            // First verify the code
            const verifyResult = await currentSignIn.verifyResetPasswordEmailCode({ code });
            
            // Then submit the new password
            result = await currentSignIn.submitResetPassword({ password: newPassword, signOutOfOtherSessions: true });
          } else if (typeof currentSignIn.submitResetPassword === 'function') {
            methodUsed = 'submitResetPassword';
            result = await currentSignIn.submitResetPassword({ code, password: newPassword, signOutOfOtherSessions: true });
          } else if (typeof currentSignIn.attemptFirstFactor === 'function') {
            methodUsed = 'attemptFirstFactor';
            result = await currentSignIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code, password: newPassword, signOutOfOtherSessions: true });
          } else {
            throw new Error("No known reset method found on signIn");
          }
        } catch (e: any) {
          console.log("Error in " + methodUsed + ": ", e);
          // Fallback if 2-step fails, maybe verify takes both?
          if (methodUsed === 'verify+submit (2-step)') {
            try {
              methodUsed = 'verifyResetPasswordEmailCode (combined)';
              result = await currentSignIn.verifyResetPasswordEmailCode({ code, password: newPassword });
            } catch (fallbackError: any) {
              throw fallbackError;
            }
          } else {
            throw e;
          }
        }

        // Sometimes the result is undefined in newer SDKs, so we check the signIn object itself
        const finalStatus = result?.status || currentSignIn.status;
        const sessionId = result?.createdSessionId || currentSignIn.createdSessionId;

        if (finalStatus === 'complete') {
          if (typeof currentSignIn.finalize === 'function') {
            await currentSignIn.finalize();
            router.push("/dashboard");
          } else {
            await activeSetActive({ session: sessionId });
            router.push("/dashboard");
          }
        } else {
          setError("Password reset incomplete. Method: " + methodUsed + ", Status: " + finalStatus);
        }
      }
    } catch (err: any) {
      console.error("Forgot Password Error:", err);
      setError(err.errors?.[0]?.longMessage || err.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen w-full flex bg-background ${GeistSans.className}`}>
      {/* Cyberpunk Grid Overlay for entire page */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px, 30px 30px',
        backgroundPosition: 'center center',
      }}></div>

      {/* Left Panel - Information */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 relative overflow-hidden bg-card/50 border-r border-white/5 shadow-[inset_-20px_0_100px_rgba(0,0,0,0.5)] z-10">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"
          />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-24"
            >
              <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,20,60,0.4)]">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">EnterprisePilot<span className="text-primary">AI</span></span>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-md"
            >
              <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
                AI Agents.<br/>Human Decisions.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 animate-[gradient_4s_linear_infinite] bg-[length:200%_auto]">Real Business Impact.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg mb-12 leading-relaxed font-light">
                EnterprisePilot AI connects specialized AI agents, company policies, and people to turn business requests into approved, actionable results at scale.
              </motion.p>

              <div className="space-y-4">
                {[
                  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "emerald", title: "1. Submit Request", desc: "Business request submitted securely" },
                  { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "primary", title: "2. AI Agents Collaborate", desc: "Agents analyze and prepare proposals" },
                  { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "amber", title: "3. Human Approval", desc: "Right people review and approve" }
                ].map((step, idx) => {
                  // handle colors for dynamic classes since Tailwind might purge them
                  const bgClass = step.color === 'emerald' ? 'bg-emerald-500/10' : step.color === 'amber' ? 'bg-amber-500/10' : 'bg-primary/10';
                  const textClass = step.color === 'emerald' ? 'text-emerald-400' : step.color === 'amber' ? 'text-amber-500' : 'text-primary';
                  const borderHover = step.color === 'emerald' ? 'hover:border-emerald-500/30' : step.color === 'amber' ? 'hover:border-amber-500/30' : 'hover:border-primary/30';
                  
                  return (
                    <motion.div variants={fadeInUp} key={idx} className={`group flex items-start gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-default ${borderHover}`}>
                      <div className={`${bgClass} p-3 rounded-xl ${textClass} group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} /></svg>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-[15px]">{step.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-hidden z-10">
        {/* Right side subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="absolute top-8 right-8 text-sm text-slate-500 z-20">
          {!isForgotPassword && (
            isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-primary hover:text-primary/80 transition-colors font-medium">Create Account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-primary hover:text-primary/80 transition-colors font-medium">Login</button></>
            )
          )}
        </div>
        
        {/* Back to Home Link */}
        <div className="absolute top-8 left-8 z-20">
          <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 text-sm transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[440px] bg-card/60 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(220,20,60,0.1)] relative z-10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(220,20,60,0.15)]">
              {isLogin ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">{isForgotPassword ? "Enter your email to reset your password" : isLogin ? "Sign in to your enterprise account" : "Join your enterprise workspace"}</p>
          </div>

          {pendingVerification ? (
            <form onSubmit={handleVerify} className="space-y-5">
              {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                    placeholder="Enter the 6-digit code sent to your email" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white transition-all transform mt-6 border border-white/10 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-[#080808]'}`}
              >
                {isLoading ? "Please wait..." : "Verify Email \u2192"}
              </button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
              
              {forgotPasswordStep === 0 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                      placeholder="name@company.com" 
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                        placeholder="Enter the 6-digit code sent to your email" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                        placeholder="Enter new password" 
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center text-sm pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsForgotPassword(false); setForgotPasswordStep(0); setError(""); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  &larr; Back to login
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white transition-all transform mt-6 border border-white/10 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-[#080808]'}`}
              >
                {isLoading ? "Please wait..." : forgotPasswordStep === 0 ? "Send Reset Code \u2192" : "Reset Password \u2192"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-5">
              {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                      placeholder="John Doe" 
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                    placeholder="name@company.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" 
                    placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>


              {isLogin ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-700 rounded bg-black/40" />
                    <label className="ml-2 block text-sm text-slate-400">Remember me</label>
                  </div>
                  <div className="text-sm">
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); setError(""); setForgotPasswordStep(0); }} 
                      className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center pt-1">
                  <input type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-slate-700 rounded bg-black/40" />
                  <label className="ml-2 block text-sm text-slate-400">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> & <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              )}

              {/* Clerk Bot Protection CAPTCHA element */}
              <div id="clerk-captcha"></div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white transition-all transform mt-6 border border-white/10 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-[#080808]'}`}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Login \u2192" : "Create Account \u2192")}
              </button>
            </form>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-slate-500 font-medium tracking-wide backdrop-blur-md">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="mt-6">
              {isLogin ? (
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button 
                    type="button"
                    className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-white/5 rounded-xl shadow-sm bg-white/[0.02] text-sm font-medium text-white hover:bg-white/[0.06] hover:border-white/10 focus:outline-none transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                </SignInButton>
              ) : (
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button 
                    type="button"
                    className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-white/5 rounded-xl shadow-sm bg-white/[0.02] text-sm font-medium text-white hover:bg-white/[0.06] hover:border-white/10 focus:outline-none transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                </SignUpButton>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
