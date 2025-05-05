import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Crop, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cropper, RectangleStencil, ImageRestriction } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { uploadFile, FileUploadResponse } from "@/lib/api";
import { toast } from "sonner";

export interface ImageMetadata {
  altText: string;
}

// This interface defines the props for the ImageUploadDialog component
export interface ImageUploadDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onImageSave: (imageUrl: string, metadata: ImageMetadata) => void;
  title?: string;
  description?: string;
  aspectRatios?: Array<{
    name: string;
    value: number | null;
  }>;
  defaultAspectRatio?: number | null;
}

export const ImageUploadDialog = ({
  open,
  onOpenChange,
  onImageSave,
  title = "Upload Image",
  description = "Upload and customize your image",
  aspectRatios = [
    { name: "Open Graph (1.91:1)", value: 1.91 },
    { name: "Square (1:1)", value: 1 },
    { name: "Standard (4:3)", value: 4/3 },
    { name: "Widescreen (16:9)", value: 16/9 },
    { name: "Free Form", value: null },
  ],
  defaultAspectRatio = 1.91,
}: ImageUploadDialogProps) => {
  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<"upload" | "edit" | "metadata">("upload");
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({
    altText: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const cropperRef = useRef<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(defaultAspectRatio);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileData, setUploadedFileData] = useState<FileUploadResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for later upload
      setSelectedFile(file);
      
      // Read the file locally for preview
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setImageTab("edit");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      // Store the file for later upload
      setSelectedFile(file);
      
      // Read the file locally for preview
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setImageTab("edit");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const applyCrop = () => {
    if (cropperRef.current) {
      try {
        const cropper = cropperRef.current;
        
        // Check if cropper is properly initialized
        if (!cropper || typeof cropper.getCanvas !== 'function') {
          console.error('Cropper not properly initialized');
          return;
        }
        
        // Get the cropped image as a canvas element
        const canvas = cropper.getCanvas();
        
        if (canvas) {
          // Convert canvas to data URL
          const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCroppedImage(croppedImageUrl);
          setImageTab("metadata");
        } else {
          console.error('Failed to get canvas from cropper');
          // Fallback to original image if cropping fails
          setCroppedImage(uploadedImage);
          setImageTab("metadata");
        }
      } catch (error) {
        console.error('Error creating cropped image:', error);
        // Fallback to original image
        setCroppedImage(uploadedImage);
        setImageTab("metadata");
      }
    }
  };

  const resetCrop = () => {
    // Reset cropping state
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  const skipCrop = () => {
    // Use the original image without cropping
    setCroppedImage(uploadedImage);
    setImageTab("metadata");
  };

  const handleImageSave = async () => {
    try {
      // Upload the file only when Save is clicked
      if (selectedFile) {
        setIsUploading(true);
        const uploadedFile = await uploadFile(selectedFile);
        setUploadedFileData(uploadedFile);
        
        // Use server URL after successful upload
        onImageSave(uploadedFile.url, imageMetadata);
        toast.success("File uploaded successfully", {
          description: "Your file has been uploaded to the server",
        });
      } else {
        // Use cropped or original image if no file was selected (unlikely)
        const finalImage = croppedImage || uploadedImage;
        if (finalImage) {
          onImageSave(finalImage, imageMetadata);
        }
      }
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setImageTab("upload");
    setImageMetadata({
      altText: ""
    });
    setUploadedFileData(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTabChange = (value: string) => {
    // Make sure we have a valid aspect ratio when switching to edit tab
    if (value === "edit") {
      // If aspect ratio is null or undefined, set it to the default
      if (aspectRatio === null || aspectRatio === undefined) {
        setAspectRatio(defaultAspectRatio || 1.91); // Ensure we have a fallback
      }
    }
    setImageTab(value as "upload" | "edit" | "metadata");
  };

  const canRenderCropper = () => {
    return uploadedImage !== null && 
           imageTab === "edit" && 
           (aspectRatio !== null && aspectRatio !== undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={imageTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="edit" disabled={!uploadedImage}>Edit</TabsTrigger>
            <TabsTrigger value="metadata" disabled={!uploadedImage}>Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="py-4">
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-64 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-1">Drag and drop an image here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Recommended size: 1200 x 630 pixels (1.91:1 ratio)</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </TabsContent>

          <TabsContent value="edit" className="py-4">
            {uploadedImage && (
              <div className="flex flex-col gap-4">
                <div className="relative border rounded-lg overflow-hidden" style={{ height: "350px", maxWidth: "500px" }}>
                  {canRenderCropper() && (
                    <Cropper
                      ref={cropperRef}
                      src={uploadedImage}
                      className="h-full w-full"
                      stencilComponent={RectangleStencil}
                      stencilProps={{
                        aspectRatio: aspectRatio || undefined
                      }}
                      imageRestriction={ImageRestriction.none}
                      defaultSize={{
                        width: 1200,
                        height: 630
                      }}
                      backgroundClassName="bg-muted"
                      checkOrientation={true}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="grid gap-2">
                    <Label>Aspect Ratio</Label>
                    <div className="flex flex-wrap gap-2">
                      {aspectRatios.map((ratio) => (
                        <Button 
                          key={ratio.name}
                          type="button" 
                          size="sm"
                          variant={aspectRatio === ratio.value ? "default" : "outline"} 
                          onClick={() => setAspectRatio(ratio.value)}
                        >
                          {ratio.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-between">
                  <Button type="button" variant="outline" onClick={resetCrop} className="flex items-center gap-1">
                    <X size={16} />
                    Reset Crop
                  </Button>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setImageTab("upload")}>
                      Back
                    </Button>
                    <Button type="button" variant="outline" onClick={skipCrop} className="flex items-center gap-1">
                      <ImageIcon size={16} />
                      Skip Cropping
                    </Button>
                    <Button type="button" onClick={applyCrop} className="flex items-center gap-1">
                      <Crop size={16} />
                      Apply & Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="py-4">
            {(uploadedImage || croppedImage) && (
              <div className="grid gap-4">
                <div className="flex items-center justify-center">
                  <div className="border rounded-md overflow-hidden w-20 h-20 flex-shrink-0">
                    <img
                      src={croppedImage || uploadedImage || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                 
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="imageAlt">Alt Text</Label>
                  <Input
                    id="imageAlt"
                    value={imageMetadata.altText}
                    onChange={(e) =>
                      setImageMetadata((prev) => ({ ...prev, altText: e.target.value }))
                    }
                    placeholder="Descriptive text for screen readers and SEO"
                  />
                </div>

                {uploadedFileData && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <h3 className="font-medium mb-1">Uploaded File Information</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground">File ID:</span>
                      <span>{uploadedFileData.file_id}</span>
                      <span className="text-muted-foreground">File Name:</span>
                      <span>{uploadedFileData.title}</span>
                      <span className="text-muted-foreground">Size:</span>
                      <span>{uploadedFileData.size} bytes</span>
                      <span className="text-muted-foreground">MIME Type:</span>
                      <span>{uploadedFileData.mime_type}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            handleReset();
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleImageSave}
            disabled={!uploadedImage || imageTab !== "metadata" || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Image'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;