// This file is machine-generated - edit at your own risk.
'use a';

/**
 * @fileOverview Generates a Word document from table data.
 *
 * - generateWordDoc - A function that handles the Word document generation process.
 * - GenerateWordDocInput - The input type for the generateWordDoc function.
 * - GenerateWordDocOutput - The return type for the generateWordDoc function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
} from 'docx';
import {parseCsv, type TableData} from '@/lib/csv';

const GenerateWordDocInputSchema = z.object({
  title: z.string().optional().describe('The title of the document.'),
  tableData: z.string().describe('The table data in CSV format.'),
  footnotes: z.string().optional().describe('Footnotes for the document.'),
});
export type GenerateWordDocInput = z.infer<typeof GenerateWordDocInputSchema>;

const GenerateWordDocOutputSchema = z.object({
  docBase64: z.string().describe('The generated Word document as a base64 encoded string.'),
});
export type GenerateWordDocOutput = z.infer<typeof GenerateWordDocOutputSchema>;

export async function generateWordDoc(
  input: GenerateWordDocInput
): Promise<GenerateWordDocOutput> {
  return generateWordDocFlow(input);
}

const generateWordDocFlow = ai.defineFlow(
  {
    name: 'generateWordDocFlow',
    inputSchema: GenerateWordDocInputSchema,
    outputSchema: GenerateWordDocOutputSchema,
  },
  async ({title, tableData, footnotes}) => {
    const parsedTable = parseCsv(tableData);

    const doc = new Document({
      sections: [
        {
          children: [
            ...(title
              ? [
                  new Paragraph({
                    children: [new TextRun({text: title, bold: true})],
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 200},
                  }),
                ]
              : []),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: parsedTable.headers.map(
                    header =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({text: header, bold: true})],
                          }),
                        ],
                      })
                  ),
                }),
                ...parsedTable.rows.map(
                  row =>
                    new TableRow({
                      children: row.map(
                        cell =>
                          new TableCell({
                            children: [new Paragraph(cell)],
                          })
                      ),
                    })
                ),
              ],
            }),
            ...(footnotes
              ? [
                  new Paragraph({
                    children: [new TextRun({text: footnotes, a: true})],
                    spacing: {before: 200},
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    const b64 = await Packer.toBase64String(doc);
    return {
      docBase64: b64,
    };
  }
);
