import { Box, CssBaseline } from "@mui/material";
import "./App.css";
import ResponsiveAppBar from "./component/NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
import ApplyCard from "./component/ApplyCard";
import Jobs from "./component/Jobs";

function App() {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState("apply");
  const getJobs = async () => {
    const res = await axios.get(process.env.REACT_APP_API_URL + "/job");
    setJobs(res.data);
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <>
      <CssBaseline />
      <ResponsiveAppBar setLocation={setLocation} />
      <Box sx={{ width: "100%", height: "100%", padding: 1 }}>
        {location === "apply" ? (
          jobs.map((v, i) => <ApplyCard key={i} job={v} />)
        ) : (
          <Jobs />
        )}
      </Box>
    </>
  );
}

export default App;
