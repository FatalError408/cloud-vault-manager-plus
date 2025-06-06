
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, File as FileIcon } from "lucide-react";
import { useStorage } from "@/contexts/StorageContext";
import { toast } from "@/components/ui/use-toast";

export function FileUploader() {
  const { categories, uploadFile } = useStorage();
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const resetUploader = () => {
    setFiles([]);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    const selectedCategory = category === "custom" ? customCategory : category;
    
    if (!selectedCategory) {
      toast({
        title: "No category selected",
        description: "Please select or enter a category",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const increment = 100 / files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], selectedCategory);
        progress += increment;
        setUploadProgress(Math.min(progress, 100));
      }
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} file(s)`,
      });
      
      resetUploader();
    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Upload Failed",
        description: "An error occurred during the upload process",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Category Input */}
          {category === "custom" && (
            <div>
              <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Category Name
              </label>
              <Input
                id="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
          )}
        </div>
        
        {/* File Input */}
        <div>
          <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
            Select Files
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              Click to upload or drag and drop files here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              id="files"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {files.length} file(s) selected
            </p>
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[15rem]">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-gray-500"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Uploading... {Math.round(uploadProgress)}%
            </p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={resetUploader} disabled={isUploading || files.length === 0}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
