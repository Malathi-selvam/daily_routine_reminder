import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import "./Login.css";
import TextField from "@mui/material/TextField";
import "@fontsource/roboto/300.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ setLoading }) {
  const [issignup, setIssignup] = useState(true);

  const [storinginput, setStoringinput] = useState({
    Name: "",
    email: "",
    password: "",
  });
  const [toverify, setToverify] = useState({
    signinemail: "",
    signinpassword: "",
  });
  const handlesignin = (e) => {
    const { name, value } = e.target;
    setToverify((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoringinput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setIssignup(!issignup);
  };
  const navigate = useNavigate();

  const handleSigninsubmit = (e) => {
    e.preventDefault();
    const { signinemail, signinpassword } = toverify;
    if (!signinemail.trim() || !signinpassword.trim()) {
      toast.warning("Please enter the details.");
      return;
    }
    setLoading(true);

    fetch("http://localhost:4000/User")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((users) => {
        console.log("Fetched users:", users);
        const matchedUser = users.find(
          (user) =>
            user.email.toLowerCase() === signinemail.toLowerCase() &&
            user.password === signinpassword
        );
        if (matchedUser) {
          toast.success("Login Successful");
          setToverify({ signinemail: "", signinpassword: "" });
          localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
          navigate("/Home");
        } else {
          toast.error("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("An error occurred during login.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { Name, email, password } = storinginput;

    if (!Name.trim() || !email.trim() || !password.trim()) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    fetch("http://localhost:4000/User")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((users) => {
        const existingUser = users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          toast.warning(
            "This email is already registered. Please use another email or sign in."
          );
          return;
        }
        fetch("http://localhost:4000/User", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storinginput),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("User Created ", data);
            toast.success("User registered successfully!");
            localStorage.setItem("loggedInUser", JSON.stringify(data));
            setStoringinput({
              Name: "",
              email: "",
              password: "",
            });
            navigate("/Home");
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("An error occurred while creating the account");
          });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("An error occurred while checking existing users.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="appbar">
        <AppBar position="static" sx={{ backgroundColor: "  #E07A8E" }}>
          <Toolbar>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                color: "  #333333",
                fontFamily: "Roboto",
              }}
            >
              Daily Routine Reminder
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <div className="container">
        <div className="text">
          <Typography variant="h2">Welcome to Reminder App</Typography>
          <p>Stay organized and never miss your daily tasks ❤️</p>
        </div>
        {issignup ? (
          <div className="form">
            <Paper elevation={20} className="paper">
              <center>
                <Typography variant="h3">Sign Up</Typography>
              </center>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                name="Name"
                value={storinginput.Name}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="email"
                value={storinginput.email}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={storinginput.password}
                onChange={handleChange}
              />
              <Button variant="contained" type="submit" onClick={handleSubmit}>
                Submit
              </Button>
              <p>
                <label> Already have an account ? </label>
                <button
                  style={{
                    color: "blue",
                    border: "none",
                    backgroundColor: "white",
                  }}
                  onClick={handleToggle}
                >
                  Sign In
                </button>
              </p>
            </Paper>
          </div>
        ) : (
          <div className="form">
            <Paper elevation={20} className="paper">
              <center>
                <Typography variant="h3">Sign In </Typography>
              </center>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="signinemail"
                value={toverify.signinemail}
                onChange={handlesignin}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                name="signinpassword"
                value={toverify.signinpassword}
                onChange={handlesignin}
              />
              <Button variant="contained" onClick={handleSigninsubmit}>
                Submit
              </Button>
              <p>
                <label> Create new account? </label>
                <button
                  style={{
                    color: "blue",
                    border: "none",
                    backgroundColor: "white",
                  }}
                  onClick={handleToggle}
                >
                  Sign Up
                </button>
              </p>
            </Paper>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
