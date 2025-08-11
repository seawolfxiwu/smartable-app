export type TableData = {
  headers: string[];
  rows: string[][];
};

export function parseCsv(csvString: string): TableData {
  const lines = csvString.trim().split('\n');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
  
  // Ensure all rows have the same number of columns as headers
  return {
    headers,
    rows: rows.map(row => {
      if (row.length < headers.length) {
        return [...row, ...Array(headers.length - row.length).fill('')];
      }
      return row.slice(0, headers.length);
    }),
  };
}

export function formatCsv(tableData: TableData): string {
  const headerString = tableData.headers.join(',');
  const rowStrings = tableData.rows.map(row => row.join(','));
  return [headerString, ...rowStrings].join('\n');
}

export function downloadCsv(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
