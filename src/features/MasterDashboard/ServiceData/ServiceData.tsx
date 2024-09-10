import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import MasterSidebar from "../../../components/SideBar/MasterSidebar";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { NestedListItem } from "../../../components/SideBar/NestedList";
import { EMasterDashboardTabPaths } from "../../../types/global";

const ServiceData = () => {
  const basePath = `/master/${EMasterDashboardTabPaths.ServiceData}`;

  const menuItems: NestedListItem[] = [
    {
      icon: CorporateFareIcon,
      primaryText: "Packages",
      path: `${basePath}/packages`,
    },
    {
      icon: CorporateFareIcon,
      primaryText: "Investigation",
      path: `${basePath}/investigation`,
    },
    {
      icon: CorporateFareIcon,
      primaryText: "Procedures",
      path: `${basePath}/procedure`,
    },
    {
      icon: CorporateFareIcon,
      primaryText: "Services",
      path: `${basePath}/service`,
    },
    // {
    //   icon: CorporateFareIcon,
    //   primaryText: 'Packages',
    //   path: `${basePath}/packages`,
    // },
    {
      icon: CorporateFareIcon,
      primaryText: "Cycles",
      children: [
        {
          icon: CorporateFareIcon,
          primaryText: "Items",
          path: `${basePath}/cycle/items`,
        },
        {
          icon: CorporateFareIcon,
          primaryText: "Stages",
          path: `${basePath}/cycle/stages`,
        },
        {
          icon: CorporateFareIcon,
          primaryText: "Consumable",
          path: `${basePath}/cycle/consumables`,
        },
      ],
    },
    {
      icon: CorporateFareIcon,
      primaryText: "Cryo Preservation",
      path: `${basePath}/cryo-preservation`,
    },
  ];

  return (
    <Box display={"flex"} flex={1} overflow={"auto"}>
      <MasterSidebar menuItems={menuItems} heading={"Service Data"} />

      <Box display={"flex"} flex={"1 1 auto"} flexDirection={"column"} overflow={"auto"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ServiceData;
