"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface HeartFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const HeartForm = ({ isOpen, onClose, onSubmit }: HeartFormProps) => {
  const [maxHr, setMaxHr] = useState("");
  const [chestPainType, setChestPainType] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [oldpeak, setOldpeak] = useState("");
  const [stSlope, setStSlope] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!maxHr || !chestPainType || !cholesterol || !oldpeak || !stSlope) {
      setError("Please fill out all 5 fields.");
      return;
    }

    setError("");
    const prompt = `Hi, can you analyze my heart health based on these details?
MAXHR: ${maxHr}, ChestPainType: ${chestPainType}, Cholesterol: ${cholesterol}, Oldpeak: ${oldpeak}, ST_Slope: ${stSlope}. 
Please tell me if this looks normal or risky, and why.`;
    onSubmit(prompt);

    setMaxHr("");
    setChestPainType("");
    setCholesterol("");
    setOldpeak("");
    setStSlope("");
  };

  const handleCancel = () => {
    setMaxHr("");
    setChestPainType("");
    setCholesterol("");
    setOldpeak("");
    setStSlope("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 border rounded-xl bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Heart Health Input</h3>
          <p className="text-sm text-muted-foreground">
            Please provide the 5 required features for analysis.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="maxHr" className="text-right text-sm font-medium">
            Max HR
          </label>
          <Input
            id="maxHr"
            type="number"
            value={maxHr}
            onChange={(e) => setMaxHr(e.target.value)}
            className="col-span-3"
            placeholder="e.g., 150"
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <label className="text-right text-sm font-medium pt-2">
            Chest Pain
          </label>
          <RadioGroup
            onValueChange={setChestPainType}
            value={chestPainType}
            className="col-span-3 flex flex-col space-y-2 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="cp-0" />
              <label htmlFor="cp-0" className="text-sm">0 (Typical Angina)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="cp-1" />
              <label htmlFor="cp-1" className="text-sm">1 (Atypical Angina)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="cp-2" />
              <label htmlFor="cp-2" className="text-sm">2 (Non-anginal Pain)</label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="cholesterol" className="text-right text-sm font-medium">
            Cholesterol
          </label>
          <Input
            id="cholesterol"
            type="number"
            value={cholesterol}
            onChange={(e) => setCholesterol(e.target.value)}
            className="col-span-3"
            placeholder="e.g., 200"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="oldpeak" className="text-right text-sm font-medium">
            Oldpeak
          </label>
          <Input
            id="oldpeak"
            type="number"
            step="0.1"
            value={oldpeak}
            onChange={(e) => setOldpeak(e.target.value)}
            className="col-span-3"
            placeholder="e.g., 1.2"
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <label className="text-right text-sm font-medium pt-2">
            ST Slope
          </label>
          <RadioGroup
            onValueChange={setStSlope}
            value={stSlope}
            className="col-span-3 flex flex-col space-y-2 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="st-0" />
              <label htmlFor="st-0" className="text-sm">0 (Upsloping)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="st-1" />
              <label htmlFor="st-1" className="text-sm">1 (Flat)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="st-2" />
              <label htmlFor="st-2" className="text-sm">2 (Downsloping)</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-center">
          <p className="text-sm text-destructive animate-in fade-in-0">
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Create Prompt
        </Button>
      </div>
    </div>
  );
};
