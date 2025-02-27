// Füge diese Komponente zu deinem Formular hinzu

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function SubmissionForm() {
  const [consentGiven, setConsentGiven] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Formular-Verarbeitung hier einfügen
    if (consentGiven) {
      // Sende das Formular ab
      console.log("Formular wird eingereicht");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vorhandene Formularfelder hier einfügen */}
      
      <div className="flex items-start space-x-2 my-4">
        <Checkbox 
          id="consent" 
          checked={consentGiven}
          onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
          className="mt-1"
          required
        />
        <Label htmlFor="consent" className="text-sm font-normal">
          Mit dem Einreichen meiner Lösungen bestätige ich, dass mich Academy Consult mit einer Rückmeldung zum Gewinnspiel benachrichtigen darf.
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="bg-[#993333] hover:bg-[#7a2828] text-white rounded-full w-full md:w-auto px-8"
        disabled={!consentGiven}
      >
        Lösungen einreichen
      </Button>
    </form>
  );
}