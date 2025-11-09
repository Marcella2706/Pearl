"use client";
import { UserProvider } from "@/app/context/UserContext";
import DoctorAuthPage from "../_components/doctorAuthPage";
import ExploreHeader from "@/app/explore/_components/explore_Header";

export default function DoctorAuthPageWrapper() {
  return (
    <UserProvider>
      <ExploreHeader />
      <DoctorAuthPage />
    </UserProvider>
  );
}