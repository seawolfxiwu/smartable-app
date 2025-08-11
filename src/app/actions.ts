'use server';

import { extractTable } from '@/ai/flows/extract-table-from-image';
import { translateTable } from '@/ai/flows/translate-table';

export async function handleExtractTable(photoDataUri: string) {
  try {
    const result = await extractTable({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error extracting table:', error);
    return { success: false, error: 'Failed to extract table from image.' };
  }
}

export async function handleTranslateTable(tableData: string, targetLanguage: string) {
  try {
    const result = await translateTable({ tableData, targetLanguage });
    return { success: true, data: result.translatedTableData };
  } catch (error) {
    console.error('Error translating table:', error);
    return { success: false, error: 'Failed to translate table.' };
  }
}
