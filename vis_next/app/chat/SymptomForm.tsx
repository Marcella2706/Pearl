"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface SymptomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const SymptomForm = ({ isOpen, onClose, onSubmit }: SymptomFormProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!symptoms || !duration || !severity) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    const prompt = `Hi, I'm experiencing the following symptoms:
Symptoms: ${symptoms}
Duration: ${duration}
Severity (1-10): ${severity}
${additionalInfo ? `Additional Information: ${additionalInfo}` : ""}

Can you help me understand what this might indicate and what steps I should take?`;
    onSubmit(prompt);

    setSymptoms("");
    setDuration("");
    setSeverity("");
    setAdditionalInfo("");
  };

  const handleCancel = () => {
    setSymptoms("");
    setDuration("");
    setSeverity("");
    setAdditionalInfo("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 border rounded-xl bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Symptom Checker</h3>
          <p className="text-sm text-muted-foreground">
            Describe your symptoms for preliminary assessment
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symptoms" className="text-sm font-medium">
            Symptoms *
          </Label>
          <Textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., Headache, fever, sore throat"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration *
            </Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 3 days"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity" className="text-sm font-medium">
              Severity (1-10) *
            </Label>
            <Input
              id="severity"
              type="number"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              placeholder="1-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional" className="text-sm font-medium">
            Additional Information (Optional)
          </Label>
          <Textarea
            id="additional"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any other relevant details (medications, allergies, etc.)"
            rows={2}
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
