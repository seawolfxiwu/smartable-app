'use server';

/**
 * @fileOverview Extracts table data from an image.
 *
 * - extractTable - A function that handles the table extraction process.
 * - ExtractTableInput - The input type for the extractTable function.
 * - ExtractTableOutput - The return type for the extractTable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTableInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a table, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ExtractTableInput = z.infer<typeof ExtractTableInputSchema>;

const ExtractTableOutputSchema = z.object({
  title: z.string().optional().describe('The title of the table, if present.'),
  tableData: z
    .string()
    .describe('The extracted table data in a suitable format (e.g., CSV, JSON).'),
  footnotes: z.string().optional().describe('Footnotes or any other text below the table, if present.'),
});
export type ExtractTableOutput = z.infer<typeof ExtractTableOutputSchema>;

export async function extractTable(input: ExtractTableInput): Promise<ExtractTableOutput> {
  return extractTableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTablePrompt',
  input: {schema: ExtractTableInputSchema},
  output: {schema: ExtractTableOutputSchema},
  prompt: `You are an expert in extracting data from tables in images.

  Given the following image of a table, extract the table title, data, and footnotes.
  The table data should be in CSV format.
  Recognize any words outside of the table, such as a table title or footnotes, and place them in the appropriate fields.
  Do not include any additional context or explanation.

  Image: {{media url=photoDataUri}}
  `,
});

const extractTableFlow = ai.defineFlow(
  {
    name: 'extractTableFlow',
    inputSchema: ExtractTableInputSchema,
    outputSchema: ExtractTableOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
