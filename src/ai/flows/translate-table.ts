'use server';

/**
 * @fileOverview Translates the content of a table to a specified language.
 *
 * - translateTable - A function that takes table data and a target language, and returns the translated table data.
 * - TranslateTableInput - The input type for the translateTable function.
 * - TranslateTableOutput - The return type for the translateTable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTableInputSchema = z.object({
  tableData: z.string().describe('The table data to translate, in string format.'),
  targetLanguage: z.string().describe('The target language to translate the table data to. Defaults to English if not provided. Examples: English, Spanish, French, Chinese.'),
});
export type TranslateTableInput = z.infer<typeof TranslateTableInputSchema>;

const TranslateTableOutputSchema = z.object({
  translatedTableData: z.string().describe('The translated table data in string format.'),
});
export type TranslateTableOutput = z.infer<typeof TranslateTableOutputSchema>;

export async function translateTable(input: TranslateTableInput): Promise<TranslateTableOutput> {
  return translateTableFlow(input);
}

const translateTablePrompt = ai.definePrompt({
  name: 'translateTablePrompt',
  input: {schema: TranslateTableInputSchema},
  output: {schema: TranslateTableOutputSchema},
  prompt: `You are a translation expert.

  Translate the following table data to the target language, maintaining the original format and structure.
  The target language is: {{{targetLanguage}}}.

  Here is the table data:
  {{{tableData}}}

  Return only the translated table data in the same format as the input.
  `,
});

const translateTableFlow = ai.defineFlow(
  {
    name: 'translateTableFlow',
    inputSchema: TranslateTableInputSchema,
    outputSchema: TranslateTableOutputSchema,
  },
  async input => {
    const {output} = await translateTablePrompt(input);
    return output!;
  }
);
