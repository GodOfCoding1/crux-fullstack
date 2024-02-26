import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import JsonDialog from "./JsonDialog";

export default function ApplicantsDialog({ job_id }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [matches, setMatches] = React.useState([]);
  const getMatches = async () => {
    const res = await axios.get(
      process.env.REACT_APP_API_URL + "/match_making",
      { params: { job: job_id } }
    );
    setMatches(
      res.data.map((v) => {
        const resumeJson = JSON.parse(v.resume.json);
        return { ...v, name: resumeJson?.NAME, json: resumeJson };
      })
    );
  };

  React.useEffect(() => {
    getMatches();
  }, []);

  return (
    <React.Fragment>
      <Button sx={{ margin: 1 }} variant="contained" onClick={handleClickOpen}>
        View Applicants
      </Button>
      <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle>
          <b>Applicants</b>
        </DialogTitle>
        <DialogContent
          sx={{
            width: "100%",
          }}
        >
          {matches.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      <b>Matching %</b>
                    </TableCell>
                    <TableCell align="right">JSON</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matches.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        {parseFloat(row.matching).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <JsonDialog data={row.json} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            "No applicants yet"
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
