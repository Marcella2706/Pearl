"use client";
import { UserProvider } from "@/app/context/UserContext"
import AuthPage from "./_components/authPage";
import ExploreHeader from "../explore/_components/explore_Header";
export default function AuthForm(){
  return( 
    <UserProvider>
      <ExploreHeader></ExploreHeader>
      <AuthPage></AuthPage>
    </UserProvider>
  )
}
