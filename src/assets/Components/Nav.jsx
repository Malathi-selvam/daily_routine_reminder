import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import "./Home.css";
import Userprofile from "./Userprofile";

function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }} className="appbar">
      <AppBar position="static" sx={{ backgroundColor: "  #E07A8E" }}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              color: "#333333",
              fontFamily: "Roboto",
            }}
          >
            Daily Routine Reminder
          </Typography>
          <Toolbar>
            <Link
              to="/MyTask"
              className="hover-link"
              style={{
                textDecoration: "none",
                marginRight: "30px",
                color: "#333333",
              }}
            >
              My Tasks
            </Link>
            <Link
              to="/NewTask"
              className="hover-link"
              style={{
                textDecoration: "none",
                marginRight: "40px",
                color: "#333333",
              }}
            >
              NewTask
            </Link>

            <Userprofile />
          </Toolbar>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Nav;
