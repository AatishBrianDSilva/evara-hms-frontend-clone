import { useMediaQuery, useTheme } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

// Custom hook to generate responsive columns
function useResponsiveColumns(columnsConfig: GridColDef[]): GridColDef[] {
  const theme = useTheme();
  // Adjusted to use theme.breakpoints.down to correctly identify mobile screens
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns: GridColDef[] = columnsConfig.map((column) => {
    // Apply mobile-specific adjustments
    if (isMobile) {
      return {
        ...column,
        width: 150, // Use mobileWidth if specified, else fall back to default width
        flex: 0, // Disable flex for mobile to use fixed widths
      };
    }
    // Apply desktop-specific adjustments (if any)
    return {
      ...column,
      width: 0, // Ensure any custom mobile adjustments are not applied in desktop view
      flex: column.flex, // Ensure flex is applied on desktop
    };
  });

  return columns;
}

export default useResponsiveColumns;
