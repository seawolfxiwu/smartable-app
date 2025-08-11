'use server';

/**
 * @fileOverview Translates the content of a table to a specified language.
 *
 * - translateTable - A function that takes table data and a target language, and returns the translated table data.
 * - TranslateTableInput - The input type for the translateTable function.
 * - TranslateTableOutput - The return type for the translateTable function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const TranslateTableInputSchema = z.object({
  tableData: z.string().describe('The table data to translate, in CSV format.'),
  title: z.string().optional().describe('The title of the table.'),
  footnotes: z.string().optional().describe('The footnotes of the table.'),
  targetLanguage: z.string().describe('The target language to translate to. Examples: English, Spanish, French, Chinese.'),
});
export type TranslateTableInput = z.infer<typeof TranslateTableInputSchema>;

const TranslateTableOutputSchema = z.object({
  translatedTableData: z.string().describe('The translated table data in the same format as the input.'),
  translatedTitle: z.string().optional().describe('The translated title of the table.'),
  translatedFootnotes: z.string().optional().describe('The translated footnotes of the table.'),
});
export type TranslateTableOutput = z.infer<typeof TranslateTableOutputSchema>;

export async function translateTable(input: TranslateTableInput, apiKey?: string): Promise<TranslateTableOutput> {
  return translateTableFlow(input, { auth: apiKey });
}

const translateTableFlow = ai.defineFlow(
  {
    name: 'translateTableFlow',
    inputSchema: TranslateTableInputSchema,
    outputSchema: TranslateTableOutputSchema,
  },
  async (input, streamingCallback, context) => {
    const apiKey = context?.auth as string | undefined;

    const translateTablePrompt = ai.definePrompt({
      name: 'translateTablePrompt',
      input: {schema: TranslateTableInputSchema},
      output: {schema: TranslateTableOutputSchema},
      prompt: `You are a translation expert.

      Translate the following table title, data, and footnotes to the target language, maintaining the original format and structure.
      The target language is: {{{targetLanguage}}}.

      {{#if title}}
      Title:
      {{{title}}}
      {{/if}}

      Table Data (CSV):
      {{{tableData}}}

      {{#if footnotes}}
      Footnotes:
      {{{footnotes}}}
      {{/if}}

      Return only the translated content in the specified JSON format.
      `,
    });

    const {output} = await translateTablePrompt(input, {
        plugins: apiKey ? [googleAI({apiKey})] : undefined,
    });
    return output!;
  }
);
