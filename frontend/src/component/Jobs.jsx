import { Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import AddJobDialog from "./AddJobDialog";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const getJobs = async () => {
    const res = await axios.get(process.env.REACT_APP_API_URL + "/job");
    setJobs(res.data);
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <>
      <AddJobDialog />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "2",
        }}
      >
        {jobs.map((v, i) => (
          <JobCard key={i} job={v} />
        ))}
      </Box>
    </>
  );
}

export default Jobs;
