'use server';

import { extractTable, type ExtractTableInput } from '@/ai/flows/extract-table-from-image';
import { generateWordDoc, type GenerateWordDocInput } from '@/ai/flows/generate-word-doc';
import { translateTable, type TranslateTableInput } from '@/ai/flows/translate-table';

export async function handleExtractTable(input: ExtractTableInput) {
  try {
    const result = await extractTable(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error extracting table:', error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('Please pass in the API key'))) {
        return { success: false, error: 'The Gemini API key is not valid or missing. Please check your environment variables.' };
    }
    return { success: false, error: 'Failed to extract table from image.' };
  }
}

export async function handleTranslateTable(input: TranslateTableInput) {
  try {
    const result = await translateTable(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error translating table:', error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('Please pass in the API key'))) {
        return { success: false, error: 'The Gemini API key is not valid or missing. Please check your environment variables.' };
    }
    return { success: false, error: 'Failed to translate table.' };
  }
}

export async function handleGenerateWordDoc(input: GenerateWordDocInput) {
    try {
        const result = await generateWordDoc(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error generating word document:', error);
        return { success: false, error: 'Failed to generate Word document.' };
    }
}
