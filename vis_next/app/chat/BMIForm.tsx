"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface BMIFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const BMIForm = ({ isOpen, onClose, onSubmit }: BMIFormProps) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!height || !weight || !age || !gender) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    const heightUnit = unit === "metric" ? "cm" : "inches";
    const weightUnit = unit === "metric" ? "kg" : "lbs";
    
    const prompt = `Hi, can you calculate and analyze my BMI?
Height: ${height} ${heightUnit}
Weight: ${weight} ${weightUnit}
Age: ${age}
Gender: ${gender}

Please calculate my BMI, tell me the category, and provide health recommendations based on the results.`;
    onSubmit(prompt);

    setHeight("");
    setWeight("");
    setAge("");
    setGender("");
  };

  const handleCancel = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setGender("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 border rounded-xl bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">BMI Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Calculate your Body Mass Index and get health insights
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Unit System</Label>
          <RadioGroup value={unit} onValueChange={setUnit} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metric" id="metric" />
              <Label htmlFor="metric" className="text-sm cursor-pointer">Metric (cm/kg)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="imperial" id="imperial" />
              <Label htmlFor="imperial" className="text-sm cursor-pointer">Imperial (in/lbs)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">
              Height
            </Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "cm" : "inches"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">
              Weight
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "kg" : "lbs"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender
            </Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="text-sm cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="text-sm cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Calculate BMI
          </Button>
        </div>
      </div>
    </div>
  );
};
