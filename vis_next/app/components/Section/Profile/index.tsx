import React, { useState } from 'react';
import { Bookmark, Star, Car, MoreHorizontal } from 'lucide-react'; 
import StarRating from '../../Common/StarRating/rating';
const LegendItem = ({ color, text }:{
    color: string;
    text: string;
}) => (
  <div className="flex items-center space-x-1.5">
    <div className={`w-2.5 h-2.5 ${color} rounded-full`}></div>
    <span className="text-xs text-foreground-muted">{text}</span>
  </div>
);

const AvailabilityBar = ({ label, segments }:{
    label: string;
    segments: { color: string; width: string; label: string }[];
}) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm font-medium text-foreground-muted w-8">{label}</span>
    <div className="flex-1 h-3 bg-background-secondary rounded-full overflow-hidden flex border border-border">
      {segments.map((segment, index) => (
        <div
          key={index}
          className={`${segment.color} ${segment.width}`}
          title={`${segment.label}: ${segment.width.replace('w-', '')}`}
        ></div>
      ))}
    </div>
  </div>
);
export default function Profile() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookMark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const availabilityData = [
    {
      label: 'W-1',
      segments: [
        { color: 'bg-primary', width: 'w-7/12', label: 'Fulfilled' },
        { color: 'bg-background-tertiary', width: 'w-3/12', label: 'Booked' },
      ],
    },
    {
      label: 'W-2',
      segments: [
        { color: 'bg-foreground', width: 'w-5/12', label: 'Arrived' },
        { color: 'bg-background-tertiary', width: 'w-2/12', label: 'Booked' },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-secondary font-sans p-4">
      <div className="w-full max-w-lg bg-background rounded-3xl shadow-2xl p-6 sm:p-8 border border-border">
        <div className="flex flex-col sm:flex-row items-start space-y-5 sm:space-y-0 sm:space-x-6">

          <img
            src="https://github.com/shadcn.png"
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg"
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = 'https://placehold.co/128x128/E0E0E0/B0B0B0?text=User'; 
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-3xl font-bold text-foreground truncate">
                Vishwas
              </h1>
              <button 
                onClick={toggleBookMark} 
                className="text-accent hover:text-accent-hover transition-colors shrink-0 ml-2"
                aria-label="Toggle bookmark"
              >
                {isBookmarked ? (
                  <Bookmark size={24} className="fill-primary" />
                ) : (
                  <Bookmark size={24} />
                )}
              </button>
            </div>
            <h3 className="text-lg font-medium text-foreground-muted mb-3">
              Developer
            </h3>
            <StarRating rating={4.4} />
            <p className="text-sm text-foreground-muted mt-4">
              Simple search for developer is a simple process and task management tool for teams.
            </p>

            <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
              <button className="bg-primary text-background font-semibold rounded-full px-10 py-3 hover:bg-primary transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shrink-0">
                Book
              </button>

              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">201</span>
                  <span className="text-sm text-foreground-muted">Patients</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">220</span>
                  <span className="text-sm text-foreground-muted">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-1">Kitesurfing</h2>
          <p className="text-base text-foreground-muted mb-4">Chmielian 12-345 M</p>
          <div className="relative w-full h-48 bg-background-secondary rounded-lg overflow-hidden shadow-inner flex items-center justify-center text-foreground-muted text-sm border border-border">
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=40.712776,-74.005974&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C40.712776,-74.005974&key=YOUR_GOOGLE_MAPS_API_KEY" // Replace YOUR_GOOGLE_MAPS_API_KEY
              alt="Google Maps Placeholder"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
            />
           
            <span className="absolute">Map Placeholder</span>
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
         
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
              <path d="M 150 250 Q 200 100 300 150 T 450 100 Q 500 70 550 150" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>

 
          <div className="flex items-center space-x-8 mt-4">
            <div className="flex items-center space-x-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center">
                <Car size={20} className="text-primary" />
              </div>
              <div>
                <span className="text-sm text-foreground-muted">Distance</span>
                <p className="text-base font-bold text-foreground">9.57 KM</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-foreground-muted">Time</span>
              <p className="text-base font-bold text-foreground">34 Min</p>
            </div>
          </div>
        </div>


        <div className="mt-8 pt-6 border-t border-border">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Availability</h2>
            <div className="flex items-center space-x-1 text-sm font-medium text-foreground-muted cursor-pointer hover:text-foreground transition-colors">
              <span>This Month</span>
              <MoreHorizontal size={16} />
            </div>
          </div>
          
 
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
            <LegendItem color="bg-primary" text="Fulfilled" />
            <LegendItem color="bg-foreground" text="Arrived" />
            <LegendItem color="bg-background-tertiary" text="Booked" />
            <LegendItem color="bg-foreground-muted" text="..." />
          </div>

          <div className="space-y-5">
            {availabilityData.map((week) => (
              <AvailabilityBar key={week.label} label={week.label} segments={week.segments} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

