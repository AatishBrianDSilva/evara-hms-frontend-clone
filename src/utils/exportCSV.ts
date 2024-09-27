export const exportToCSV = (rows: any[], fileName: string) => {
  // Check if headers are provided
  const headers = rows[0] instanceof Array ? rows[0] : Object.keys(rows[0]);

  // Create the CSV content
  const csvContent =
    "data:text/csv;charset=utf-8," +
    headers.join(",") +
    "\n" + // Join headers
    rows
      .slice(1)
      .map((row) => Object.values(row).join(","))
      .join("\n"); // Join rows after headers

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link); // Cleanup after download
};
