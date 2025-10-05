import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Exports a given HTML element to a PNG image.
 * @param element The HTML element to capture.
 * @param fileName The desired name for the downloaded file.
 */
export const exportToPng = async (element: HTMLElement | null, fileName: string) => {
  if (!element) {
    console.error("Element to capture is null.");
    return;
  }
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2, // Higher scale for better resolution
    backgroundColor: getComputedStyle(document.body).backgroundColor, // Match theme background
  });
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, fileName);
    }
  });
};

/**
 * Converts an array of objects to a CSV string.
 * @param data The array of objects to convert.
 * @returns The CSV string.
 */
const arrayToCsv = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(fieldName =>
        JSON.stringify(row[fieldName] ?? '', (key, value) => value ?? '')
      ).join(',')
    )
  ];
  return csvRows.join('\n');
};

/**
 * Exports data to a CSV file.
 * @param data The array of objects to export.
 * @param fileName The desired name for the downloaded file.
 */
export const exportToCsv = (data: any[], fileName: string) => {
  const csvString = arrayToCsv(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

/**
 * Exports data to an XLSX (Excel) file.
 * @param data The array of objects to export.
 * @param fileName The desired name for the downloaded file.
 */
export const exportToXlsx = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, fileName);
};
