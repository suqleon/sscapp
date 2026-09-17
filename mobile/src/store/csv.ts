import * as FS from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

type Cell = string | number | boolean | null | undefined;

/**
 * CSV tuned for Excel in Spanish locales: ';' separator (Excel es-* uses ';'
 * as list separator, so a double-click opens columns correctly), CRLF line
 * endings, and a UTF-8 BOM so tildes/ñ display right. Google Sheets and
 * Numbers auto-detect it too.
 */
export function toCSV(rows: Record<string, Cell>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v: Cell) => {
    const s = v == null ? '' : typeof v === 'boolean' ? (v ? 'Sí' : 'No') : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(';'), ...rows.map((r) => headers.map((h) => esc(r[h])).join(';'))];
  return '﻿' + lines.join('\r\n');
}

/** Writes the CSV and opens the OS share sheet (native) or downloads it (web). */
export async function shareCSV(filename: string, rows: Record<string, Cell>[]): Promise<void> {
  const csv = toCSV(rows);

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const dir = FS.cacheDirectory;
  if (!dir) throw new Error('No hay carpeta temporal disponible');
  const uri = `${dir}${filename}`;
  await FS.writeAsStringAsync(uri, csv);
  if (!(await Sharing.isAvailableAsync())) throw new Error('Compartir no está disponible en este dispositivo');
  await Sharing.shareAsync(uri, { mimeType: 'text/csv', dialogTitle: filename, UTI: 'public.comma-separated-values-text' });
}
