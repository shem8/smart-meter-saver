import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    // בדיקת סוג הקובץ
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      toast({
        title: "סוג קובץ לא נתמך",
        description: "אנא העלה קובץ CSV או Excel (.xls, .xlsx)",
        variant: "destructive"
      });
      return;
    }

    // בדיקת גודל הקובץ (מקסימום 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "הקובץ גדול מדי",
        description: "גודל הקובץ לא יכול לעבור 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
    
    toast({
      title: "הקובץ הועלה בהצלחה!",
      description: `${file.name} מוכן לעיבוד`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            העלה את דוח הצריכה שלך
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            העלה קובץ CSV או Excel עם נתוני הצריכה שלך ותוך שניות תדע איזה מסלול הכי משתלם
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card 
            className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
              dragOver 
                ? 'border-primary bg-primary/5 shadow-glow' 
                : selectedFile
                  ? 'border-success bg-success/5 shadow-card'
                  : 'border-muted-foreground/30 hover:border-primary hover:bg-accent/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!selectedFile ? openFileDialog : undefined}
          >
            {selectedFile ? (
              // הצגת הקובץ שנבחר
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
                      {selectedFile.name} • {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button variant="secondary" onClick={openFileDialog}>
                    <Upload className="w-4 h-4" />
                    החלף קובץ
                  </Button>
                  <Button variant="default">
                    חשב עכשיו
                  </Button>
                </div>
              </div>
            ) : (
              // אזור העלאה
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  גרור את הקובץ לכאן או לחץ לבחירה
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  תומך בקבצי CSV, Excel (.xls, .xlsx)
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
            )}
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default FileUpload;