import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FileUploader } from "react-drag-drop-files";
import {
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { UploadFile } from "@mui/icons-material";

const fileTypes = ["PDF"];

export default function ApplyDialog({ job_id }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };
  const [files, setFiles] = React.useState([]);
  const handleChange = (file) => {
    const files_new = [];
    for (let index = 0; index < file.length; index++) {
      files_new.push(file[index]);
    }
    setFiles(files_new);
  };
  const [loading, setLoading] = React.useState(false);

  const handleUpload = async () => {
    if (files.length === 0)
      return window.alert("Please select atleast one file");
    try {
      setLoading(true);
      await Promise.all(
        files.map((v) => {
          const formData = new FormData();
          formData.append("file", v);
          formData.append("job", job_id);
          return axios.post(
            process.env.REACT_APP_API_URL + "/resume/",
            formData
          );
        })
      );
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
          Successfully applied
        </Alert>
      </Snackbar>
      <Button variant="outlined" onClick={handleClickOpen}>
        Apply To Job
      </Button>
      <Dialog width="lg" open={open} onClose={handleClose}>
        <DialogTitle>Apply Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apply to job using multiple resumes
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 2,
              m: "auto",
              width: "100%",
            }}
          >
            <FileUploader
              multiple={true}
              handleChange={handleChange}
              name="file"
              types={fileTypes}
              classes={"file-uploader"}
            />
            <List>
              {files.map((v) => (
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <InsertDriveFileIcon />
                    </ListItemAvatar>
                    <ListItemText primary={v.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<UploadFile />}
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
