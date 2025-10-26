"use client"
import ExploreHeader from "./_components/explore_Header"
import Profile from "../components/Section/Profile";
import { MapProvider } from "../context/MapContext";
import { MapDisplay } from "./_components/maps";
export default function Page() {
    
    return (
        <>
        <ExploreHeader />
            <MapProvider>
                <MapDisplay></MapDisplay>
            </MapProvider>
        </>
    )
}