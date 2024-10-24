import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Dashboard from "@mui/icons-material/Dashboard";
import AppsIcon from "@mui/icons-material/Apps";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Grid from "@mui/material/Grid";
import { DateRangeIcon } from "@mui/x-date-pickers";
import {
  Analytics,
  Diversity1,
  LocalPharmacy,
  Logout,
  Settings,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCredentials } from "../../features/Auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { handlePersistorPurge, RootState } from "../../app/store";
import _, { debounce } from "lodash";
import { useGetPatientsQuery } from "../../services/patientsApi";
import PatientCard from "../PatientCard/PatientCard";
import { CircularProgress, ListItemIcon, Popover } from "@mui/material";
import { calculateAge } from "../../utils/calculateAge";
import * as Sentry from "@sentry/react";
import { ENVIRONMENT } from "../../utils/apiConfig";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const DesktopHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);

  const hideSearchMenu =
    location.pathname.startsWith("/master") ||
    location.pathname.startsWith("/analytics") ||
    location.pathname.startsWith("/pharmacy") ||
    location.pathname.startsWith("/ivf-registration");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [appsAnchorEl, setAppsAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [searchAnchorEl, setSearchAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const handleSearchChange = React.useCallback(
    debounce((event) => {
      setSearchQuery(event.target.value);
    }, 300),
    []
  );

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    handleSearchChange(event);
  };

  const handleSearchMenuOpen = (event: any) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const {
    data: patientsData,
    isLoading: isPatientLoading,
    isFetching: isPatientFetching,
  } = useGetPatientsQuery(
    {
      searchQuery: searchQuery,
      paginate: false,
    },
    {
      skip: searchQuery === "",
    }
  );

  const loading = isPatientLoading || isPatientFetching;
  const patients = patientsData?.data?.records || [];

  const isMenuOpen = Boolean(anchorEl);
  const isSearchMenuOpen = Boolean(searchAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAppsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAppsAnchorEl(null);
  };

  const handleAppsMenuNavigation = (path: string) => {
    navigation(path);
    setAppsAnchorEl(null);
  };

  const renderBranchName = () => {
    switch (user?.branchId.trim()) {
      case "KN":
        return "Kanpur"
      case "LK":
        return "Lucknow"
      default:
        break;
    }
  }

  const accountMenuId = "desktop-header-account-menu";
  const appsMenuId = "desktop-header-apps-menu";
  const searchMenuId = "desktop-header-search-menu";

  const renderAccountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ padding: "10px" }}>
        <Typography
          sx={{
            padding: "10px",
            fontSize: "16px",
            color: "primary.main",
          }}
        >
          Name: {_.upperFirst(user?.username)}
        </Typography>
        <Typography
          sx={{
            padding: "10px",
            fontSize: "16px",
            color: "secondary.main",
          }}
        >
          Role: {_.upperFirst(user?.role)}
        </Typography>
      </Box>
      <MenuItem
        onClick={() => {
          dispatch(clearCredentials());
          handlePersistorPurge();
          Sentry.setUser(null);
          sessionStorage.clear();
          localStorage.clear();
          window.location.reload();
        }}
      >

        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const renderAppsMenu = (
    <Menu
      anchorEl={appsAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={appsMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(appsAnchorEl)}
      onClose={handleMenuClose}
    >
      <Grid container columnSpacing={1} rowSpacing={4} py={4}>
        {/* Example grid items, replace with your actual app icons and functionality */}
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/")}
          >
            <Dashboard />
          </IconButton>
          <Typography variant="caption" align="center">
            Dashboard
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/ivf-registration")}
          >
            <PersonAddIcon />
          </IconButton>
          <Typography variant="caption" align="center">
            Registration
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/appointments")}
          >
            <DateRangeIcon />
          </IconButton>
          <Typography variant="caption" align="center">
            Appointments
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/pharmacy")}
          >
            <LocalPharmacy />
          </IconButton>
          <Typography variant="caption" align="center">
            Pharmacy
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/analytics")}
          >
            <Analytics />
          </IconButton>
          <Typography variant="caption" align="center">
            Analytics
          </Typography>
        </Grid>
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/master")}
          >
            <Settings />
          </IconButton>
          <Typography variant="caption" align="center">
            Master
          </Typography>
        </Grid>
        {/* <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton sx={{ color: 'gray', width: 'fit-content', margin: 'auto' }}>
            <Diversity3 />
          </IconButton>
          <Typography variant="caption" align="center">
            Donors
          </Typography>
        </Grid> */}
        <Grid item display={"flex"} flexDirection={"column"} md={6} lg={4}>
          <IconButton
            sx={{ color: "gray", width: "fit-content", margin: "auto" }}
            onClick={() => handleAppsMenuNavigation("/patients")}
          >
            <Diversity1 />
          </IconButton>
          <Typography variant="caption" align="center">
            Patients
          </Typography>
        </Grid>
      </Grid>
    </Menu>
  );

  const renderSearchMenu = (
    <Popover
      sx={{ mt: 1 }}
      id={searchMenuId}
      open={isSearchMenuOpen}
      disableAutoFocus
      disableEnforceFocus
      anchorEl={searchAnchorEl}
      onClose={() => {
        setSearchAnchorEl(null);
        setSearchQuery("");
        setInputValue("");
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box
        sx={{
          width: "400px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!searchQuery && (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            Search for a patient by ID, Name, or number
          </Typography>
        )}
        {loading && <CircularProgress />}
        {searchQuery &&
          !loading &&
          (patients.length > 0 ? (
            <Box
              mt={15}
              py={5}
              gap={2}
              display={"flex"}
              flexDirection={"column"}
            >
              {patients.map((patient) => (
                <PatientCard
                  key={patient.patientId}
                  patientId={patient.patientId}
                  profileUrl={patient.image}
                  firstName={patient.firstName}
                  lastName={patient.lastName}
                  gender={patient.gender}
                  age={calculateAge(new Date(patient.dob))}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" style={{ textAlign: "center" }}>
              No patient found
            </Typography>
          ))}
      </Box>
    </Popover>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar variant="dense" sx={{ display: "flex" }}>
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <Box
              component="img"
              alt="Evara HMS Logo"
              src="/evara-hms-logo.png"
              sx={{
                height: 40,
                width: 40,
                objectFit: "contain",
                cursor: "pointer",
                mr: 2,
              }}
              onClick={() => handleAppsMenuNavigation("/")}
            />

            {ENVIRONMENT !== "prod" && (
              <Typography variant="body1" color="white">
                Development Environment
              </Typography>
            )}
          </Box>

          {!hideSearchMenu && (
            <Box
              display={"flex"}
              flex={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  value={inputValue}
                  placeholder="Search patients…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleInputChange}
                  onFocus={handleSearchMenuOpen}
                />
              </Search>
            </Box>
          )}
          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            display={"flex"}
            flex={1}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Box boxShadow={1} paddingX={1} bgcolor={"background.paper"} borderRadius={2} sx={{ mr: 2 }}><Typography color={"secondary.main"}>{renderBranchName()}</Typography></Box>
            <IconButton
              size="large"
              aria-label="open-apps-drawer"
              aria-controls={appsMenuId}
              aria-haspopup="true"
              onClick={handleAppsMenuOpen}
              color="inherit"
            >
              <AppsIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderAccountMenu}
      {renderAppsMenu}
      {renderSearchMenu}
    </>
  );
};

export default DesktopHeader;
