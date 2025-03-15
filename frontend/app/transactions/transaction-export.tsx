"use client";

import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { autoTable } from "jspdf-autotable";

interface Transaction {
  _id: string;
  transactionType: "buy" | "sell" | "deposit" | "withdrawal";
  stockSymbol?: string;
  bank?: string;
  amount?: number;
  quantity?: number;
  price?: number;
  timestamp: number;
}

interface TransactionExportProps {
  transactions: Transaction[];
}

export default function TransactionExport({
  transactions,
}: TransactionExportProps) {
  // Export as CSV
  const exportCSV = () => {
    const csvData = transactions.map((txn) => ({
      Date: new Date(txn.timestamp).toLocaleDateString(),
      Type: txn.transactionType.toUpperCase(),
      Asset: txn.stockSymbol || txn.bank || "N/A",
      Quantity: txn.quantity || "-",
      Price: txn.price ? `$${txn.price.toFixed(2)}` : "-",
      Amount: `$${txn.amount?.toFixed(2) || (txn.quantity && txn.price ? (txn.quantity * txn.price).toFixed(2) : "0")}`,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Transaction_History.csv");
  };

  // Enhanced PDF Export
  const exportPDF = () => {
    // Create new PDF document
    const doc = new jsPDF();

    // Add custom font
    doc.setFont("helvetica", "bold");

    // Define colors
    const primaryColor = [41, 55, 99]; // Dark blue
    const secondaryColor = [83, 110, 199]; // Medium blue
    const accentColor: [number, number, number] = [145, 169, 237]; // Light blue

    // Document header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("FINANCIAL STATEMENT", 14, 20);

    // Date range and generation info
    const today = new Date().toLocaleDateString();
    const oldestDate = transactions.length
      ? new Date(
          Math.min(...transactions.map((t) => t.timestamp))
        ).toLocaleDateString()
      : "N/A";
    const newestDate = transactions.length
      ? new Date(
          Math.max(...transactions.map((t) => t.timestamp))
        ).toLocaleDateString()
      : "N/A";

    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, doc.internal.pageSize.width - 60, 15);
    doc.text(
      `Period: ${oldestDate} - ${newestDate}`,
      doc.internal.pageSize.width - 60,
      22
    );

    // Summary section
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 40, doc.internal.pageSize.width, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("ACCOUNT SUMMARY", 14, 48);

    // Calculate summary data
    const totalDeposits = transactions
      .filter((t) => t.transactionType === "deposit")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.transactionType === "withdrawal")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalBuys = transactions
      .filter((t) => t.transactionType === "buy")
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.price || 0), 0);

    const totalSells = transactions
      .filter((t) => t.transactionType === "sell")
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.price || 0), 0);

    const totalTrades = transactions.filter(
      (t) => t.transactionType === "buy" || t.transactionType === "sell"
    ).length;

    const netBalance =
      totalDeposits + totalSells - totalWithdrawals - totalBuys;

    // Draw summary boxes
    doc.setFillColor(245, 245, 245);

    // Box 1
    doc.roundedRect(14, 55, 55, 30, 3, 3, "F");
    // Box 2
    doc.roundedRect(75, 55, 55, 30, 3, 3, "F");
    // Box 3
    doc.roundedRect(136, 55, 55, 30, 3, 3, "F");

    // Summary text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(9);
    doc.text("DEPOSITS", 19, 63);
    doc.text("WITHDRAWALS", 80, 63);
    doc.text("NET BALANCE", 141, 63);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`$${totalDeposits.toFixed(2)}`, 19, 75);
    doc.text(`$${totalWithdrawals.toFixed(2)}`, 80, 75);

    // Net balance (colored green for positive, red for negative)
    if (netBalance >= 0) {
      doc.setTextColor(0, 128, 0); // Green for positive
    } else {
      doc.setTextColor(192, 0, 0); // Red for negative
    }
    doc.text(`$${netBalance.toFixed(2)}`, 141, 75);

    // Trading activity section
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 95, doc.internal.pageSize.width, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("TRANSACTION HISTORY", 14, 103);

    // Transaction table
    const tableData = transactions.map((txn) => [
      new Date(txn.timestamp).toLocaleDateString(),
      txn.transactionType.toUpperCase(),
      txn.stockSymbol || txn.bank || "N/A",
      txn.quantity || "-",
      txn.price ? `$${txn.price.toFixed(2)}` : "-",
      `$${txn.amount?.toFixed(2) || (txn.quantity && txn.price ? (txn.quantity * txn.price).toFixed(2) : "0")}`,
    ]);

    // Add table to the PDF
    autoTable(doc, {
      startY: 110,
      head: [["Date", "Type", "Asset", "Quantity", "Price", "Amount"]],
      body: tableData,
      headStyles: {
        fillColor: accentColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // Add page number at the bottom
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Confidential - For Account Holder Only`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Save PDF
    doc.save("Financial_Statement.pdf");
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportPDF}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
