"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface BloodPressureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const BloodPressureForm = ({ isOpen, onClose, onSubmit }: BloodPressureFormProps) => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!systolic || !diastolic || !heartRate || !timeOfDay) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    const prompt = `Hi, can you analyze my blood pressure reading?
Systolic: ${systolic} mmHg
Diastolic: ${diastolic} mmHg
Heart Rate: ${heartRate} bpm
Time of Day: ${timeOfDay}

Please tell me if this reading is normal, and provide any recommendations or concerns.`;
    onSubmit(prompt);

    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setTimeOfDay("");
  };

  const handleCancel = () => {
    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setTimeOfDay("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 border rounded-xl bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Blood Pressure Check</h3>
          <p className="text-sm text-muted-foreground">
            Enter your blood pressure reading for analysis
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systolic" className="text-sm font-medium">
              Systolic (Upper)
            </Label>
            <Input
              id="systolic"
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="mmHg (e.g., 120)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diastolic" className="text-sm font-medium">
              Diastolic (Lower)
            </Label>
            <Input
              id="diastolic"
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="mmHg (e.g., 80)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heartRate" className="text-sm font-medium">
            Heart Rate
          </Label>
          <Input
            id="heartRate"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="bpm (e.g., 72)"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Time of Day</Label>
          <RadioGroup value={timeOfDay} onValueChange={setTimeOfDay} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning" className="text-sm cursor-pointer">Morning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="afternoon" />
              <Label htmlFor="afternoon" className="text-sm cursor-pointer">Afternoon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="evening" />
              <Label htmlFor="evening" className="text-sm cursor-pointer">Evening</Label>
            </div>
          </RadioGroup>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Analyze
          </Button>
        </div>
      </div>
    </div>
  );
};
