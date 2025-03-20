import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const SignIn = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600">Welcome back to the Learning Portal</p>
        </div>
        <ClerkSignIn
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md",
              card: "shadow-none",
              headerSubtitle: "hidden",
              headerTitle: "hidden",
              rootBox: "w-full",
              socialButtonsBlockButton: 
                "flex justify-center border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md",
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignIn;
