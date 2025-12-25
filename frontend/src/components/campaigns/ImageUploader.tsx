import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (file: File | null, previewUrl: string | null) => void;
  currentImage?: string | null;
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ onImageSelect, currentImage, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelect(file, url);
    toast.success("Image uploaded successfully");
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null, null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    toast.info("Image removed");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload campaign image"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview}
            alt="Campaign preview"
            className="w-full h-48 sm:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={removeImage}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <span className="text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded">
              Click to change
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10"
              : error
              ? "border-destructive bg-destructive/10"
              : "border-border hover:border-primary/50 hover:bg-secondary/30",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click();
            }
          }}
          aria-label="Drop zone for campaign image upload"
        >
          <div className="flex flex-col items-center justify-center text-center">
            {error ? (
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mb-3" />
            ) : isDragging ? (
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 animate-bounce" />
            ) : (
              <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3" />
            )}
            
            <p className="text-sm font-medium mb-1">
              {isDragging
                ? "Drop your image here"
                : error
                ? "Try again"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, or WebP • Max 5MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1" role="alert">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
