import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import ImageUploadDialog from "@/components/common/Image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  altText?: string;
  onAltTextChange?: (altText: string) => void;
  label?: string;
}

/**
 * A component for uploading images in the Puck editor
 * Uses the ImageUploadDialog for a complete image upload, crop, and metadata experience
 * Also provides a direct URL input option and alt text field
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange, 
  label, 
  altText = "", 
  onAltTextChange 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [localAltText, setLocalAltText] = useState(altText);
  const [initialized, setInitialized] = useState(false);
  
  // Keep local alt text in sync with prop
  useEffect(() => {
    setLocalAltText(altText);
  }, [altText]);

  // Only sync value with urlInput on first render or when we get a new image URL
  // from the image uploader (when value changes but urlInput doesn't match)
  useEffect(() => {
    if (!initialized || (value && value !== urlInput && imageTab === "url")) {
      setUrlInput(value || '');
      setInitialized(true);
    }
  }, [value, urlInput, imageTab, initialized]);
  
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };
  
  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAltText = e.target.value;
    setLocalAltText(newAltText);
    if (onAltTextChange) {
      onAltTextChange(newAltText);
    }
  };
  
  const handleUrlSubmit = () => {
    onChange(urlInput);
  };
  
  const handleImageSave = (imageUrl: string, metadata: { altText: string }) => {
    console.log("handleImageSave")
    console.log(imageUrl, metadata,"image url and metadata")
    
    // Store the image URL
    onChange(imageUrl);
    setUrlInput(imageUrl); // Update urlInput state with the new image URL
    
    // Update alt text if provided in metadata
    if (metadata.altText && onAltTextChange) {
      setLocalAltText(metadata.altText);
      onAltTextChange(metadata.altText);
    }
    setDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label || "Image"}</label>
      </div>
      
      <Tabs
        defaultValue="upload"
        value={imageTab}
        onValueChange={(val) => setImageTab(val as "upload" | "url")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-2">
          <Button 
            type="button" 
            onClick={() => setDialogOpen(true)} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {value ? "Change Image" : "Select Image"}
          </Button>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-2">
          <div className="flex space-x-2">
            <Input
              value={urlInput}
              onChange={handleUrlInputChange}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} type="button">
              Apply
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {value && (
        <div className="mt-2 border rounded-md p-2 relative">
          <img 
            src={value} 
            alt={localAltText || "Preview"}
            className="w-full h-auto object-contain max-h-40" 
          />
          <Button 
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => onChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Alt text field */}
      <div className="space-y-2">
        <Label htmlFor="alt-text" className="text-sm font-medium text-gray-700">Alt Text</Label>
        <Input
          id="alt-text"
          value={localAltText}
          onChange={handleAltTextChange}
          placeholder="Describe the image for accessibility"
          className="w-full"
        />
      </div>
      
      <ImageUploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onImageSave={handleImageSave}
        title="Upload Image"
        description="Choose an image for your content"
      />
    </div>
  );
};

export default ImageUploader;
