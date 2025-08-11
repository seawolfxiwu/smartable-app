'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handleExtractTable, handleTranslateTable } from '@/app/actions';
import { downloadCsv, formatCsv, parseCsv, type TableData } from '@/lib/csv';
import { FileUpload } from './file-upload';
import { DataTable } from './data-table';
import { Download, Languages, Loader2, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Italian', label: 'Italian' },
];

export default function LinguaTableApp() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalTable, setOriginalTable] = useState<TableData | null>(null);
  const [translatedTable, setTranslatedTable] = useState<TableData | null>(null);
  const [targetLang, setTargetLang] = useState<string>('English');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsExtracting(true);
    setOriginalTable(null);
    setTranslatedTable(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setImagePreview(dataUri);
      
      const result = await handleExtractTable(dataUri);
      if (result.success) {
        setOriginalTable(parseCsv(result.data));
        toast({
          title: 'Success!',
          description: 'Table extracted from image.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.error,
        });
        setImagePreview(null);
      }
      setIsExtracting(false);
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the selected file.',
      });
      setIsExtracting(false);
    };
  };

  const handleTranslate = async () => {
    if (!originalTable) return;
    setIsTranslating(true);
    setTranslatedTable(null);

    const csvData = formatCsv(originalTable);
    const result = await handleTranslateTable(csvData, targetLang);

    if (result.success) {
      setTranslatedTable(parseCsv(result.data));
      toast({
        title: 'Success!',
        description: `Table translated to ${targetLang}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error,
      });
    }
    setIsTranslating(false);
  };
  
  const handleReset = () => {
    setImagePreview(null);
    setOriginalTable(null);
    setTranslatedTable(null);
    setIsExtracting(false);
    setIsTranslating(false);
  }

  const isProcessing = isExtracting || isTranslating;

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Upload Your Table Image
          </CardTitle>
          <CardDescription>
            Extract data from an image and translate it instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!originalTable && (
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isExtracting}
            />
          )}

          {isExtracting && (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Extracting table data...</p>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Uploaded preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-contain mt-4"
                  data-ai-hint="table document"
                />
              )}
            </div>
          )}

          {originalTable && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Original Table</h3>
                <DataTable data={originalTable} onUpdate={setOriginalTable} isProcessing={isProcessing}/>
                <div className="mt-4 flex justify-between items-center">
                    <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        Start Over
                    </Button>
                    <Button onClick={() => downloadCsv(formatCsv(originalTable), 'original_table.csv')} disabled={isProcessing}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Original (CSV)
                    </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="text-xl font-semibold mb-3">Translate Table</h3>
                <div className="flex items-center gap-4">
                  <Select
                    onValueChange={setTargetLang}
                    defaultValue={targetLang}
                    disabled={isProcessing}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleTranslate} disabled={isProcessing || !originalTable}>
                    {isTranslating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Languages className="mr-2 h-4 w-4" />
                    )}
                    Translate
                  </Button>
                </div>
              </div>

              {isTranslating && (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Translating to {targetLang}...</p>
                </div>
              )}

              {translatedTable && (
                 <div className="space-y-2 animate-in fade-in duration-500">
                    <h3 className="text-xl font-semibold">Translated Table ({targetLang})</h3>
                    <DataTable data={translatedTable} onUpdate={setTranslatedTable} isProcessing={isProcessing} />
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => downloadCsv(formatCsv(translatedTable), `translated_table_${targetLang}.csv`)} disabled={isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Translated (CSV)
                      </Button>
                    </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
