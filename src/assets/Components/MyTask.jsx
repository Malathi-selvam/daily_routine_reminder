import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaHistory } from "react-icons/fa";
import History from "./History";

function MyTask() {
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.email) {
      const storedTasks =
        JSON.parse(localStorage.getItem(`tasks_${loggedInUser.email}`)) || [];
      const storedHistory =
        JSON.parse(localStorage.getItem(`history_${loggedInUser.email}`)) || [];

      const now = new Date();
      const activeTasks = [];
      const expiredTasks = [];

      storedTasks.forEach((task) => {
        const taskDateTime = new Date(`${task.taskdate}T${task.tasktime}`);
        if (taskDateTime < now) {
          expiredTasks.push(task);
        } else {
          activeTasks.push(task);
        }
      });

      // Update localStorage
      localStorage.setItem(
        `tasks_${loggedInUser.email}`,
        JSON.stringify(activeTasks)
      );
      localStorage.setItem(
        `history_${loggedInUser.email}`,
        JSON.stringify([...storedHistory, ...expiredTasks])
      );

      setTasks(activeTasks);
      setUserEmail(loggedInUser.email);
    } else {
      setTasks([]);
    }
  }, []);

  const handleDelete = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
    if (userEmail) {
      localStorage.setItem(`tasks_${userEmail}`, JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      <div className="image-bar">
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#E07A8E",
            boxShadow: "0 2px 4px 2px rgba(0,0,0,0.2)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                color: "#fff",
                fontWeight: 500,
              }}
            >
              My Tasks
            </Typography>
            <IconButton
              onClick={() => setShowHistory(!showHistory)}
              sx={{ color: "#fff", ml: 2 }}
              title="View History"
            >
              <FaHistory size={22} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      {showHistory ? (
        <History />
      ) : (
        <Box
          sx={{ padding: 4, backgroundColor: "#fdf6f9", minHeight: "100vh" }}
        >
          {tasks.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              No tasks yet. Add your first one!
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {tasks.map((task, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "#fff0f5",
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(224, 122, 142, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 20px rgba(224, 122, 142, 0.3)",
                      },
                    }}
                  >
                    {task.image && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          typeof task.image === "string"
                            ? task.image
                            : task.image.url
                        }
                        alt="Task"
                      />
                    )}

                    <CardContent sx={{ position: "relative" }}>
                      <IconButton
                        onClick={() => handleDelete(index)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "#ffe6e6",
                          "&:hover": { backgroundColor: "#ffcccc" },
                        }}
                      >
                        <DeleteIcon sx={{ color: "#d32f2f" }} />
                      </IconButton>

                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {task.taskname}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {task.taskdescription}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {task.taskdate && `Date: ${task.taskdate}`}{" "}
                        {task.tasktime && `| Time: ${task.tasktime}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
}

export default MyTask;
