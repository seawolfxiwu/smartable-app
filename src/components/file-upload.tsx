'use client';

import { UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer transition-colors',
        isDragActive && 'border-primary bg-primary/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <UploadCloud className="h-10 w-10 text-primary" />
        </div>
        {isDragActive ? (
          <p className="font-medium text-primary">Drop the image here ...</p>
        ) : (
          <div>
            <p className="font-medium">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground mt-1">or</p>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={(e) => e.preventDefault()}
          disabled={disabled}
        >
          Select File
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
}
