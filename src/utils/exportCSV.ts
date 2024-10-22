export const exportToCSV = (rows: any[], fileName: string) => {
  // Check if headers are provided
  const headers = rows[0] instanceof Array ? rows[0] : Object.keys(rows[0]);

  // Create the CSV content with UTF-8 BOM to handle special characters
  const csvContent =
    "\uFEFF" + // Add BOM for UTF-8
    headers.join(",") +
    "\n" + // Join headers
    rows
      .slice(1)
      .map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" ? `"${value}"` : value)) // Ensure string values are wrapped in quotes
          .join(",")
      )
      .join("\n"); // Join rows after headers

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Cleanup after download
};
