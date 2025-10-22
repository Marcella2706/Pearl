"use client";
import { UserProvider } from "@/app/context/UserContext"
import AuthPage from "./_components/authPage";
export default function AuthForm(){
  return( 
    <UserProvider>
      <AuthPage></AuthPage>
    </UserProvider>
  )
}
