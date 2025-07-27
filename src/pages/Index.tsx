import { useState } from "react";
import Hero from "@/components/Hero";
import PlansComparison from "@/components/PlansComparison";
import FileUpload from "@/components/FileUpload";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // כאן נוסיף את לוגיקת עיבוד הקובץ
    console.log("Selected file:", file.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PlansComparison />
      <FileUpload onFileSelect={handleFileSelect} />
    </div>
  );
};

export default Index;
