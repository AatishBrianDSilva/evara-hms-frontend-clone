import { useNavigate } from "react-router-dom";
import { navListType } from "./types";
import ArticleIcon from "@mui/icons-material/Article";

export const navList: navListType[] = [
  {
    id: 0,
    title: "Console",
    path: "/",
    icon: ArticleIcon,
    onSelect: () => {},
  },
  {
    id: 1,
    title: "IVF Registration",
    path: "/ivf-registration",
    icon: ArticleIcon,
    onSelect: () => {},
  },
  {
    id: 2,
    title: "Patients",
    path: "/patients",
    icon: ArticleIcon,
    onSelect: () => {},
  },
  {
    id: 3,
    title: "Appointments",
    path: "/appointments",
    icon: ArticleIcon,
    onSelect: () => {},
  },
];
