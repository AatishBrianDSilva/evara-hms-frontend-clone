import * as React from "react";
import { Box, Typography, Avatar, Link } from "@mui/material";
import { stringAvatar } from "../../utils/avatar";

interface PatientCardProps {
  patientId: string;
  profileUrl?: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patientId,
  profileUrl,
  firstName,
  lastName,
  gender,
  age,
}) => {
  let name = `${firstName}`;
  if (lastName) {
    name += ` ${lastName}`;
  }

  if (typeof profileUrl != "string") {
    profileUrl = "";
  }

  const image_sx = { height: 56, width: 56, border: "2px solid", borderColor: "secondary.main" };

  return (
    <Link
      href={`/patient/${patientId}`}
      underline="none"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        display="flex"
        alignItems="center"
        borderRadius={4}
        border="1px solid"
        borderColor="grey.300"
        p={2}
        width={300}
        sx={{ "&:hover": { boxShadow: 3 } }}
      >
        <Box display={"flex"} flex={1}>
          <Avatar {...stringAvatar(name, image_sx)} src={profileUrl} />
        </Box>
        <Box display="flex" flexDirection="column" flex={2}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2">{`Gender: ${gender}`}</Typography>
          <Typography variant="body2">{`Age: ${age}`}</Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default PatientCard;
