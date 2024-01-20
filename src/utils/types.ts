import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type navListType = {
  id: number;
  title: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  onSelect: () => void;
};
