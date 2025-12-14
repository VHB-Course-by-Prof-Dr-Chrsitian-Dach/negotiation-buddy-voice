import { VoiceInterface } from "@/components/VoiceInterface";
import { Navigation } from "@/components/Navigation";
import { useParams, useNavigate } from "react-router-dom";
import { getCaseById } from "@/data/negotiationCases";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Practice = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const negotiationCase = caseId ? getCaseById(caseId) : undefined;

  useEffect(() => {
    if (!negotiationCase && caseId) {
      // Case not found, redirect to case selection
      navigate("/cases");
    }
  }, [negotiationCase, caseId, navigate]);

  if (!negotiationCase) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/cases")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cases
        </Button>
        
        <VoiceInterface negotiationCase={negotiationCase} />
      </div>
    </div>
  );
};

export default Practice;
