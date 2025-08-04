import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/provider/userprovider";
import { Label } from "@radix-ui/react-label";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import { UserIcon, MailIcon, LockIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OTPEntryPage from "./optpage";
export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpPage,setIsOtpPage ] = useState(false); 
  const { currentUser,googleAuth, generateOTP, sendOTP, changePassword, signUp, signIn } = useUser();
  useEffect(() => {
    if (currentUser) {
      redirect("/flow");
    }
  }, [currentUser]);
  async function waitForOtpVerification(checkInterval = 100, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (localStorage.getItem("otpVerified") === "true") {
          clearInterval(interval);
          resolve(true);
          localStorage.removeItem("otpVerified");
        }
      }, checkInterval);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error("OTP verification timed out"));
      }, timeout);
    });
  }
  const onSubmit = async ( data: { email?: string; password?: string; name?: string; confirmPassword?:string }) => {
    console.log("Form Data:", data);
    if (isForgotPassword) {
      const email = data.email;
      const password = data.password;
      setIsOtpPage(true);
  
      const response = await sendOTP(email as string);
      if (!response) {
        throw new Error('Failed to send OTP');
      }
  
      await waitForOtpVerification();
  
      console.log("Changing Password");
      await changePassword(email as string, password as string);
  
      localStorage.removeItem("currentOtp");
      reset();
      redirect("/flow");
    }

    if (isSignUp) {

      const email=data.email;
      const password=data.password;
      const name=data.name;

      if (data.password !== data.confirmPassword) {
        return setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
      }

      setIsOtpPage(true);
      const response= await sendOTP(email as string);
      if(!response){
        throw new Error('Failed to send OTP')
      }

      await waitForOtpVerification();

      localStorage.removeItem("currentOtp");

      signUp(email as string,password as string,name as string)
      redirect("/flow");
    } 

    else {
      const email=data.email;
      const password=data.password;
      signIn(email as string,password as string)
      }
    reset();
    redirect("/flow");
  };

  const googlelogin = useGoogleLogin({
    onSuccess: async (cred: TokenResponse) => {
      console.log(cred);
      const token = await googleAuth(cred.access_token);
      localStorage.setItem('__Pearl_Token', token);
      localStorage.setItem('__Google_Access_Token__', cred.access_token);
      redirect("/flow");
    },
    onError: () => console.log("Login Failed"),
    scope: "openid profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send",
  });

 return isOtpPage ? (
     <div>
       <OTPEntryPage generateOTP={generateOTP} />
     </div>
   ) : (
  <div>
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-100/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
   <div className="flex justify-center items-center h-screen ">
      <Card className="w-[400px] bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-lg">
      <div className="p-6 space-y-6">
        <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300 bg-clip-text text-transparent">
          {isForgotPassword
          ? "Reset Password"
          : isSignUp
            ? "Create Account"
            : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-600">
          {isForgotPassword
          ? "Enter your email to reset password"
          : isSignUp
            ? "Sign up for an amazing experience"
            : "Sign in to continue your journey"}
        </p>
        </div>
        <AnimatePresence mode="wait">
        {!isForgotPassword && !isSignUp && (
          <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          >
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 bg-gray-50/80 border border-gray-200 hover:bg-gray-100/80 text-gray-700 py-2 rounded-lg"
            onClick={() => googlelogin()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#6b7280"
              d="M12 10.2V14h5.6c-.3 1.3-1 2.4-2 3.1v2.6h3.2c1.9-1.8 3-4.3 3-7.1 0-.7-.1-1.3-.2-1.9H12z"
            />
            <path
              fill="#f3b6b6"
              d="M6.8 14.6l-.9.7-2.5 1.9C5.1 20.8 8.4 23 12 23c3 0 5.5-1 7.4-2.6l-3.2-2.5c-.9.6-2.1 1-3.4 1-2.7 0-5-1.8-5.9-4.3z"
            />
            <path
              fill="#f472b6"
              d="M3.4 6.7C2.5 8.4 2 10.2 2 12c0 1.8.5 3.6 1.4 5.3l3.4-2.6c-.4-1.1-.6-2.2-.6-2.7 0-.6.2-1.6.6-2.7L3.4 6.7z"
            />
            <path
              fill="#9ca3af"
              d="M12 4.8c1.7 0 3.2.6 4.4 1.7L19.5 4C17.5 2.2 14.9 1 12 1 8.4 1 5.1 3.2 3.4 6.7l3.4 2.6C7 6.8 9.3 4.8 12 4.8z"
            />
            </svg>
            <span className="text-gray-700 font-medium">
            Continue With Google
            </span>
          </Button>
          </motion.div>
        )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {isSignUp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <Label htmlFor="name" className="text-sm text-gray-700">
            Name
            </Label>
            <div className="relative">
            <UserIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              id="name"
              {...register("name")}
              className="pl-10 bg-gray-50/50 border border-gray-200 text-gray-900 py-2 rounded-lg focus:border-rose-300 focus:ring-rose-100"
              required
            />
            </div>
          </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-700">
          Email
          </Label>
          <div className="relative">
          <MailIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="email"
            {...register("email")}
            type="email"
            className="pl-10 bg-gray-50/50 border border-gray-200 text-gray-900 py-2 rounded-lg focus:border-rose-300 focus:ring-rose-100"
            required
          />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-gray-700">
          Password
          </Label>
          <div className="relative">
          <LockIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="password"
            {...register("password")}
            type="password"
            className="pl-10 bg-gray-50/50 border border-gray-200 text-gray-900 py-2 rounded-lg focus:border-rose-300 focus:ring-rose-100"
            required
          />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {(isSignUp || isForgotPassword) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-2"
          >
            <Label
            htmlFor="confirmPassword"
            className="text-sm text-gray-700"
            >
            Confirm Password
            </Label>
            <div className="relative">
            <LockIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              id="confirmPassword"
              {...register("confirmPassword")}
              type="password"
              className="pl-10 bg-gray-50/50 border border-gray-200 text-gray-900 py-2 rounded-lg focus:border-rose-300 focus:ring-rose-100"
              required
            />
            </div>
            {errors.confirmPassword &&
            typeof errors.confirmPassword.message === "string" && (
              <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 via-rose-400 to-rose-400 text-white font-semibold hover:from-rose-500 hover:via-rose-500 hover:to-rose-500 transition-all duration-200 rounded-lg py-2 shadow-lg"
        >
          {isForgotPassword
          ? "Reset Password"
          : isSignUp
            ? "Create Account"
            : "Sign In"}
        </Button>
        </form>

        <Button
        variant="link"
        className="w-full text-gray-500 hover:text-gray-700 transition-colors"
        onClick={() => {
          setIsForgotPassword(false);
          setIsSignUp(!isSignUp);
        }}
        >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
        </Button>
        {!isSignUp && (
        <Button
          variant="link"
          className="w-full text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setIsForgotPassword(!isForgotPassword)}
        >
          {isForgotPassword ? "Back to Sign In" : "Forgot Password?"}
        </Button>
        )}
      </div>
      </Card>
    </div>
  </section>
   </div>
 );
}