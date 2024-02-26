import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ApplyDialog from "./ApplyDialog";

const capitalizeFirstLetter = (string) =>
  string
    ? string
        .split(" ")
        .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
        .join(" ")
    : "";

export default function ApplyCard({ job }) {
  return (
    <Card sx={{ minWidth: 275, width: "fit-content", padding: 1, margin: 2 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          paddingBottom: 0,
        }}
      >
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          component="div"
        >
          {job.company}
        </Typography>
        <Typography variant="h6">
          <b>{capitalizeFirstLetter(job.role)}</b>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {job.description}
        </Typography>
      </CardContent>
      <CardActions>
        <ApplyDialog job_id={job.id} />
      </CardActions>
    </Card>
  );
}
