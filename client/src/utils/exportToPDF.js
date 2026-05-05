// src/utils/exportToPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(borrowData) {
  const doc = new jsPDF("landscape"); // Use landscape for wide tables

  // Title
  doc.setFontSize(16);
  doc.text("Borrow Records Report", 14, 15);

  // Format table data
  const tableBody = borrowData.map((item, index) => [
    index + 1,
    item.book.title,
    item.book.author,
    item.book.category,
    item.user.name,
    item.user.email,
    item.borrowed_quantity,
    item.status,
    item.borrow_date,
    item.return_date,
    item.librarian.name,
  ]);

  autoTable(doc, {
    head: [
      [
        "#",
        "Book Title",
        "Author",
        "Category",
        "Borrower",
        "Email",
        "Qty",
        "Status",
        "Borrow Date",
        "Return Date",
        "Librarian",
      ],
    ],
    body: tableBody,
    startY: 20,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [221, 235, 247],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "left",
      valign: "middle",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },   // #
      6: { halign: "center", cellWidth: 10 },   // Qty
      7: { halign: "center", cellWidth: 20 },   // Status
      8: { halign: "center", cellWidth: 25 },   // Borrow Date
      9: { halign: "center", cellWidth: 25 },   // Return Date
    },
  });

  doc.save("borrow_records.pdf");
}
