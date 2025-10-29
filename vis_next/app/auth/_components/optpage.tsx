"use client"
import { OTPInput } from "./otpInput"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
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
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-foreground/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="w-96 rounded-lg p-8 bg-background-secondary/90 backdrop-blur-xl border border-border shadow-xl transition-all duration-300 relative z-10">
        <h1 className="text-2xl font-bold text-center text-foreground transition-colors duration-300">
          Enter OTP
        </h1>
        <p className="text-sm text-center mb-4 text-foreground transition-colors duration-300">
          Please enter the 6-digit code sent to your device
        </p>
        
        <OTPInput length={6} onComplete={handleOTPComplete}  />
        
        {error && (
          <p className="mt-4 text-sm text-center text-accent transition-colors duration-300" role="alert">
            {error}
          </p>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={isSubmitting}
            className="py-2 px-4 rounded-lg bg-background-tertiary border border-border text-foreground hover:bg-background-secondary transition-all duration-300"
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
            className="rounded-lg py-2 px-4 bg-primary text-background hover:bg-primary transition-all duration-300"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
}