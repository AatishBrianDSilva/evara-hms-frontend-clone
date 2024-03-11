import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface navListType {
  isAccordion?: boolean;
  accordionItems?: navListType[];
  id: number;
  title: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> | null;
  onSelect: () => void;
}
