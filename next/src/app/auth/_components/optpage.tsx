"use client"
import { OTPInput } from "./otpInput"
import { Button } from "@/components/ui/Button"
import { useState } from "react"
export default function OTPEntryPage({generateOTP}:{
 generateOTP:()=>string
}) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
const handleOTPComplete = async (otp: string) => {
 setError(null)
 setIsSubmitting(true)
 const currentOtp=localStorage.getItem('currentOtp')
 console.log(otp);
 console.log(currentOtp);
 try {
   if (otp === currentOtp) {
     localStorage.setItem('otpVerified','true')
   } else {
     setError("Invalid OTP. Please try again.")
   }
 } catch (err) {
   setError(`An error occurred ${err}. Please try again.`)
 } finally {
   setIsSubmitting(false)
 }
};
const handleResendOTP = () => {
 const newOtp=generateOTP()
 console.log(newOtp)
 localStorage.removeItem('currentOtp');
 localStorage.setItem('currentOtp',newOtp);
 console.log(localStorage.getItem('currentOtp'));
};
  return (
    <div className="auth-page flex justify-center items-center">
      <div className="absolute inset-0">
        <div className="auth-background-overlay absolute inset-0" />
      </div>

      <div className="auth-blob-1 absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" />
      <div className="auth-blob-2 absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="auth-card w-96 rounded-lg p-8">
        <h1 className="auth-title text-2xl font-bold text-center">
          Enter OTP
        </h1>
        <p className="auth-subtitle text-sm text-center mb-4">
          Please enter the 6-digit code sent to your device
        </p>
        
        <OTPInput length={6} onComplete={handleOTPComplete}  />
        
        {error && (
          <p className="auth-error-text mt-4 text-sm text-center" role="alert">
            {error}
          </p>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={isSubmitting}
            className="auth-google-btn py-2 px-4 rounded-lg"
          >
            Resend OTP
          </Button>
          
          <Button
            onClick={() => {
            const otpInputs = Array.from(document.querySelectorAll('input[type="text"]'));
            const otp = otpInputs.map(input => (input as HTMLInputElement).value).join('');
            handleOTPComplete(otp)
            }}
            disabled={isSubmitting}
            className="auth-submit-btn rounded-lg py-2 px-4"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
}