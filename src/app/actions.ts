'use server';

import { extractTable } from '@/ai/flows/extract-table-from-image';
import { translateTable, type TranslateTableInput } from '@/ai/flows/translate-table';

export async function handleExtractTable(photoDataUri: string) {
  try {
    const result = await extractTable({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error extracting table:', error);
    return { success: false, error: 'Failed to extract table from image.' };
  }
}

export async function handleTranslateTable(input: TranslateTableInput) {
  try {
    const result = await translateTable(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error translating table:', error);
    return { success: false, error: 'Failed to translate table.' };
  }
}
