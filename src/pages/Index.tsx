import { useState } from "react";
import Hero from "@/components/Hero";
import PlansComparison from "@/components/PlansComparison";
import FileUpload from "@/components/FileUpload";
import HowToGetReport from "@/components/HowToGetReport";
import CustomPlan from "@/components/CustomPlan";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'instructions' | 'custom' | 'upload'>('home');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log("Selected file:", file.name);
  };

  const handleStartCalculation = () => {
    setCurrentView('upload');
  };

  const handleShowInstructions = () => {
    setCurrentView('instructions');
  };

  const handleSelectPreset = (planType: string) => {
    setSelectedPlan(planType);
    setCurrentView('upload');
  };

  const handleCreateCustom = () => {
    setCurrentView('custom');
  };

  const handleCustomPlanSelect = (customPlan: any[]) => {
    console.log("Custom plan selected:", customPlan);
    setCurrentView('upload');
  };

  const backToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onStartCalculation={handleStartCalculation}
        onShowInstructions={handleShowInstructions}
      />
      
      {currentView === 'home' && (
        <PlansComparison 
          onSelectPreset={handleSelectPreset}
          onCreateCustom={handleCreateCustom}
        />
      )}
      
      {currentView === 'instructions' && (
        <>
          <HowToGetReport />
          <div className="text-center py-8">
            <button 
              onClick={backToHome}
              className="text-primary hover:underline"
            >
              ← חזור לעמוד הראשי
            </button>
          </div>
        </>
      )}
      
      {currentView === 'custom' && (
        <>
          <CustomPlan onPlanSelect={handleCustomPlanSelect} />
          <div className="text-center py-8">
            <button 
              onClick={backToHome}
              className="text-primary hover:underline"
            >
              ← חזור לעמוד הראשי
            </button>
          </div>
        </>
      )}
      
      {currentView === 'upload' && (
        <>
          <FileUpload onFileSelect={handleFileSelect} />
          <div className="text-center py-8">
            <button 
              onClick={backToHome}
              className="text-primary hover:underline"
            >
              ← חזור לבחירת מסלול
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
