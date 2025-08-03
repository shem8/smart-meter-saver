import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xls|xlsx)$/i)
    ) {
      toast({
        title: "סוג קובץ לא נתמך",
        description: "אנא העלה קובץ CSV או Excel (.xls, .xlsx)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "הקובץ גדול מדי",
        description: "גודל הקובץ לא יכול לעבור 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    toast({
      title: "הקובץ הועלה בהצלחה!",
      description: `${file.name} - החישוב מתחיל...`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const loadExampleFile = async () => {
    setIsLoadingExample(true);
    try {
      const response = await fetch("/example.csv");
      if (!response.ok) {
        throw new Error("Failed to load example file");
      }

      const blob = await response.blob();
      const file = new File([blob], "example.csv", {
        type: "text/csv",
      });

      setSelectedFile(file);
      onFileSelect(file);

      toast({
        title: "קובץ דוגמה נטען בהצלחה!",
        description: "example.csv - החישוב מתחיל...",
      });
    } catch (error) {
      console.error("Error loading example file:", error);
      toast({
        title: "שגיאה בטעינת קובץ הדוגמה",
        description: "לא ניתן לטעון את קובץ הדוגמה",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExample(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {selectedFile ? (
        <Card className="p-8 border-2 border-success bg-success/5 shadow-card">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success-foreground" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  קובץ הועלה בהצלחה!
                </h3>
                <p className="text-muted-foreground">
                  {selectedFile.name} • {(selectedFile.size / 1024).toFixed(1)}{" "}
                  KB
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-success-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>מחשב תוצאות...</span>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card
            className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-muted-foreground/30 hover:border-primary hover:bg-accent/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                גרור את הקובץ לכאן או לחץ לבחירה
              </h3>

              <p className="text-muted-foreground mb-6">
                תומך בקבצי CSV (מומלץ), Excel (.xls, .xlsx)
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>CSV, XLS, XLSX</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>מקסימום 10MB</span>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  או
                </span>
              </div>
            </div>
          </div>

          <Card className="p-6 border-2 border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                נסה עם קובץ דוגמה
              </h3>

              <p className="text-muted-foreground mb-4">
                טען קובץ דוגמה עם נתוני צריכה לדוגמה כדי לנסות את המערכת
              </p>

              <Button
                onClick={loadExampleFile}
                disabled={isLoadingExample}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {isLoadingExample ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    טוען קובץ דוגמה...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    טען קובץ דוגמה
                  </>
                )}
              </Button>
            </div>
          </Card>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
