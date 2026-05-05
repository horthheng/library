import ExcelJS from "exceljs";

async function getBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

export async function exportToExcel(data, filename) {
  if (!data || !Array.isArray(data) || !data.length) {
    throw new Error("No data to export");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Borrow Records");

  const totalColumns = Object.keys(data[0]).length;

  // Add Logo
  const logoBase64 = await getBase64("/logo.png"); // your public logo path
  const logoId = workbook.addImage({ base64: logoBase64, extension: "png" });
  worksheet.addImage(logoId, {
    tl: { col: 0.5, row: 0.5 }, 
    ext: { width: 60, height: 60 }
  });

  // Title Row
  worksheet.mergeCells(1, 1, 1, totalColumns);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Borrow Records Report";
  titleCell.font = { size: 16};
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDEBF7" } };
  worksheet.getRow(1).height = 60;

  // Generated Date
  worksheet.mergeCells(2, 1, 2, totalColumns);
  const dateCell = worksheet.getCell("A2");
  dateCell.value = `Generated on: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })}`;
  dateCell.font = { size: 10, italic: true, color: { argb: "444444" } };
  dateCell.alignment = { horizontal: "center", vertical: "middle" };

  // Header Row
  const headers = Object.keys(data[0]);
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2C3E50" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };
  });

  // Data Rows
  data.forEach((item) => {
    const rowValues = headers.map((key) => item[key] || "");
    const row = worksheet.addRow(rowValues);

    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 || headers[colNumber - 1]?.toLowerCase() === "status" ? "center" : "left"
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  // Set column widths dynamically
  worksheet.columns.forEach((col, i) => {
    const maxLength = Math.max(
      headers[i].length,
      ...data.map((d) => (d[headers[i]] ? String(d[headers[i]]).length : 0))
    );
    col.width = Math.min(Math.max(maxLength + 5, 15), 35);
  });

  // Freeze header row
  worksheet.views = [{ state: "frozen", ySplit: 3 }];

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
}
