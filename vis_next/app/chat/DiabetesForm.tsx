"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface DiabetesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const DiabetesForm = ({ isOpen, onClose, onSubmit }: DiabetesFormProps) => {
  const [glucose, setGlucose] = useState("");
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!glucose || !bmi || !age || !bloodPressure) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    const prompt = `Hi, can you assess my diabetes risk based on these details?
Glucose Level: ${glucose} mg/dL, BMI: ${bmi}, Age: ${age}, Blood Pressure: ${bloodPressure} mmHg.
Please provide an analysis and recommendations.`;
    onSubmit(prompt);

    setGlucose("");
    setBmi("");
    setAge("");
    setBloodPressure("");
  };

  const handleCancel = () => {
    setGlucose("");
    setBmi("");
    setAge("");
    setBloodPressure("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 border rounded-xl bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Diabetes Risk Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Enter your health metrics for diabetes screening
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="glucose" className="text-right text-sm font-medium">
            Glucose
          </Label>
          <Input
            id="glucose"
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            className="col-span-3"
            placeholder="mg/dL (e.g., 120)"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bmi" className="text-right text-sm font-medium">
            BMI
          </Label>
          <Input
            id="bmi"
            type="number"
            step="0.1"
            value={bmi}
            onChange={(e) => setBmi(e.target.value)}
            className="col-span-3"
            placeholder="e.g., 25.5"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="age" className="text-right text-sm font-medium">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="col-span-3"
            placeholder="years"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bp" className="text-right text-sm font-medium">
            Blood Pressure
          </Label>
          <Input
            id="bp"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className="col-span-3"
            placeholder="mmHg (e.g., 80)"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
