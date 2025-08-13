import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function History() {
  const [historyTasks, setHistoryTasks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.email) {
      const storedHistory =
        JSON.parse(localStorage.getItem(`history_${loggedInUser.email}`)) || [];
      setHistoryTasks(storedHistory);
      setUserEmail(loggedInUser.email);
    }
  }, []);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#A58FAA",
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
            Task History
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4, backgroundColor: "#f9f4fb", minHeight: "100vh" }}>
        {historyTasks.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No history yet. Expired tasks will show here.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {historyTasks.map((task, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#f1e4f3",
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(165, 143, 170, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 20px rgba(165, 143, 170, 0.3)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {task.taskname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
    </>
  );
}

export default History;
