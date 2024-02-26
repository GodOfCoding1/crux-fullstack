import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Alert, DialogTitle, Snackbar, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { Add } from "@mui/icons-material";

export default function AddJobDialog({ job_id }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [data, setData] = React.useState({
    company: "",
    role: "",
    description: "",
  });

  const handleUpload = async () => {
    if (
      data.company.length === 0 ||
      data.role.length === 0 ||
      data.description.length === 0
    )
      return window.alert("Please input all fields");
    try {
      setLoading(true);
      await axios.post(process.env.REACT_APP_API_URL + "/job/", data);
      setSnackBar(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      window.alert("Some error occured");
    }
  };

  const [snackBar, setSnackBar] = React.useState(false);
  return (
    <React.Fragment>
      <Snackbar
        open={snackBar}
        autoHideDuration={6000}
        onClose={() => setSnackBar(false)}
      >
        <Alert
          onClose={() => setSnackBar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully added job
        </Alert>
      </Snackbar>
      <Button sx={{ margin: 1 }} variant="outlined" onClick={handleClickOpen}>
        Add Job
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>
          <b>Create job</b>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <TextField
              label="Company Name"
              variant="outlined"
              fullWidth={true}
              sx={{ width: "lg" }}
              value={data.company}
              onChange={(v) =>
                setData((prev) => ({ ...prev, company: v.target.value }))
              }
            />
            <TextField
              label="Job Role"
              variant="outlined"
              fullWidth={true}
              value={data.role}
              onChange={(v) =>
                setData((prev) => ({ ...prev, role: v.target.value }))
              }
            />
            <TextField
              label="Job Describtion"
              fullWidth={true}
              multiline
              rows={4}
              value={data.description}
              onChange={(v) =>
                setData((prev) => ({ ...prev, description: v.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<Add />}
            variant="contained"
            onClick={handleUpload}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
