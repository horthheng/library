import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function exportTableToPdf(headers, rows, title = 'Report', filename = 'table.pdf') {
  console.log('Starting PDF generation:', { headers, rows, title, filename });

  try {
    if (!Array.isArray(headers) || headers.length === 0) {
      throw new Error('Invalid headers: Must be a non-empty array');
    }
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Invalid rows: Must be a non-empty array');
    }
    if (!rows.every(row => Array.isArray(row) && row.length === headers.length)) {
      throw new Error('Invalid row data: Each row must be an array matching headers length');
    }

    const pdf = new jsPDF('p', 'pt', 'a4');
    console.log('jsPDF instance created');

    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    // Load Khmer font
    async function loadFont() {
      try {
        const response = await fetch('/NotoSansKhmer-VariableFont_wdth.ttf'); // Ensure in /public
        if (!response.ok) throw new Error('Failed to fetch font');
        const fontData = await response.arrayBuffer();
        const base64String = arrayBufferToBase64(fontData);

        // Use a consistent internal name
        pdf.addFileToVFS('NotoSansKhmer.ttf', base64String);
        pdf.addFont('NotoSansKhmer.ttf', 'NotoSansKhmer', 'normal');

        console.log('✅ Khmer font loaded');
        return true;
      } catch (err) {
        console.warn('⚠️ Font loading failed, falling back to Helvetica:', err.message);
        pdf.setFont('Helvetica');
        return false;
      }
    }

    const fontLoaded = await loadFont();

    // Title (always Helvetica for a clean look)
    pdf.setFont('Helvetica');
    pdf.setFontSize(16);
    pdf.text(title, 50, 40);

    // Table with Khmer font if loaded
    const tableFont = fontLoaded ? 'NotoSansKhmer' : 'Helvetica';

    autoTable(pdf, {
      startY: 60,
      head: [headers],
      body: rows,
      margin: { left: 40, right: 40 },
      styles: {
        font: tableFont,
        fontSize: 12,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 0,
        font: tableFont
      }
    });

    // Download PDF
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ PDF download triggered:', filename);
  } catch (err) {
    console.error('❌ exportTableToPdf error:', err.message, err.stack);
    throw err;
  }
}
