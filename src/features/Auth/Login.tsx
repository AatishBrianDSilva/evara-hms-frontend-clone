import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useLoginUserMutation } from "../../services/authApi";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { jwtDecode } from "jwt-decode";
import { useGetActiveBranchesQuery } from "../../services/masterDashboardService/global/globalBranch";
import FieldAutocomplete from "../../components/FieldAutoComplete/FieldAutoComplete";

interface LoginFormValues {
  email: string;
  password: string;
  branch: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  branch: Yup.string().required("Branch is required"),
});

export const CLINICID = "EV";


const Login: React.FC = () => {

  const theme = useTheme();

  const navigate = useNavigate();

  const { showPromiseToast } = useToast();

  const { data, isLoading, isFetching } = useGetActiveBranchesQuery(CLINICID);
  const branches = data?.data || [];

  const gettingBranches = isLoading || isFetching;

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const handleSubmit = async (values: LoginFormValues) => {
    const payload = {
      email: values.email,
      password: values.password,
      branchId: values.branch,
      clinicId: CLINICID,
    };

    console.log(payload);

    const promise = loginUser(payload).unwrap();

    showPromiseToast(promise, {
      loading: "Logging in...",
      success: (response) => response?.message || "Logged in successfully",
      error: (err) => err || "An error occurred",
    });

    try {
      const res = await promise;
      if (res?.data?.tokens?.token) {
        const user: { sub: string; name: string; email: string } = jwtDecode(
          res?.data?.tokens?.token
        );
        console.log(user);
        Sentry.setUser({
          id: user.sub,
          email: user.email,
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      branch: "",
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={"center"}
      minHeight="100vh"
      bgcolor={grey[300]}
    >
      <Box
        component={"form"}
        onSubmit={formik.handleSubmit}
        sx={{
          p: 4,
          borderRadius: "16px",
          width: "20%",
          bgcolor: theme.palette.background.paper,
        }}
        display={"flex"}
        flexDirection={"column"}
        gap={4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          variant="h2"
          color={"primary"}
          fontFamily={"Montserrat"}
          fontWeight={500}
          gutterBottom
        >
          EVARA
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          LOGIN
        </Typography>
        <FieldAutocomplete
          fullWidth
          options={branches}
          getOptionLabel={(option) => (option ? option.branchName : "")}
          isOptionEqualToValue={(option, value) => option.branchId === value.branchId}
          loading={gettingBranches}
          label="Branch"
          value={
            branches.find((branch) => branch.branchId === formik.values.branch) || null
          }
          onChange={(value) => {
            formik.setFieldValue("branch", value?.branchId ?? "", true);
          }}
          error={formik.touched.branch && Boolean(formik.errors.branch)}
          helperText={formik.touched.branch && formik.errors.branch}

        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          color="primary"
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          color="primary"
        />
        <Button fullWidth type="submit" variant="contained" color="secondary" disabled={loginLoading || gettingBranches}>
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
