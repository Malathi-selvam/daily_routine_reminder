import React from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Nav from "./Nav";
import TextField from "@mui/material/TextField";
import ForDateandTime from "./ForDateandTime";
import Box from "@mui/material/Box";
import { FaPlus, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdArrowForwardIos } from "react-icons/md";

function NewTask({ setLoading }) {
  const [newtask, setNewtask] = useState({
    taskname: "",
    taskdescription: "",
    taskdate: dayjs().format("YYYY-MM-DD"),
    tasktime: "",
    image: null,
  });
  const [recurrenceType, setRecurrenceType] = useState("");
  const [list, setList] = useState("Newtask-with-reminder");
  const navigate = useNavigate();
  const location = useLocation();

  const handleplus = () => {
    navigate("/Manageimages", {
      state: {
        currentTask: newtask,
        previousList: list,
        previousRecurrenceType: recurrenceType,
      },
    });
  };

  const handlesave = async () => {
    setLoading(true); // Show the loading bar at the top

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!loggedInUser || !loggedInUser.email) {
        toast.error("No user logged in. Please log in first.");
        return;
      }

      // Validation logic
      if (!newtask.taskname || !newtask.taskdescription) {
        toast.error("Please enter both task name and description.");
        return;
      }

      if (
        list !== "No-reminder" &&
        (!newtask.tasktime || newtask.tasktime.trim() === "")
      ) {
        toast.error("Please select a time for the reminder.");
        return;
      }

      if (
        list === "continuous-reminder" &&
        recurrenceType === "weekly" &&
        (!newtask.days || newtask.days.length === 0)
      ) {
        toast.error("Please select at least one day for weekly reminder.");
        return;
      }

      if (
        list === "continuous-reminder" &&
        recurrenceType === "interval" &&
        !/^every\s+\d+\s+(minute|hour)$/i.test(newtask.tasktime)
      ) {
        toast.error(
          "Invalid interval format. Use 'every X minute' or 'every X hour'."
        );
        return;
      }

      const cleanTask = {
        ...newtask,
        recurrence: list === "continuous-reminder" ? recurrenceType : "once",
        image:
          typeof newtask.image === "string"
            ? newtask.image
            : newtask.image?.url || null,
        notified: false,
        completed: false,
      };

      const emailKey = `tasks_${loggedInUser.email}`;
      const existingTasks = JSON.parse(localStorage.getItem(emailKey)) || [];
      const updatedTasks = [...existingTasks, cleanTask];
      localStorage.setItem(emailKey, JSON.stringify(updatedTasks));

      toast.success("Task saved successfully!");
      navigate("/MyTask");
    } catch (error) {
      toast.error("An error occurred while saving the task.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      setNewtask((prev) => ({
        ...(location.state.currentTask || prev),
        ...(location.state.selectedImage && {
          image: location.state.selectedImage,
        }),
      }));

      if (location.state.previousList) {
        setList(location.state.previousList);
      }

      if (location.state.previousRecurrenceType) {
        setRecurrenceType(location.state.previousRecurrenceType);
      }
    }
  }, [location.state]);

  return (
    <>
      <Nav />
      <div className="Total-page">
        <div className="list-newtask">
          <Typography variant="h4">✨ 𝐋𝖾𝗍’𝗌 </Typography>
          <Typography variant="h4"> ꭑα𝗄𝖾 𝗍ⱺᑯα𝗒 </Typography>
          <Typography variant="h4" style={{ paddingBottom: "20px" }}>
            𝖼ⱺυ𐓣𝗍
          </Typography>

          <div className="reminder-option">
            <li
              onClick={() => {
                setList("Newtask-with-reminder");
              }}
            >
              Remind at a Scheduled time
            </li>
            <MdArrowForwardIos />
          </div>
          <div className="reminder-option">
            <li
              onClick={() => {
                setList("No-reminder");
              }}
            >
              No reminder, only for save
            </li>{" "}
            <MdArrowForwardIos />
          </div>
          <div className="reminder-option">
            <li
              onClick={() => {
                setList("continuous-reminder");
              }}
            >
              Continuous Reminder
            </li>
            <MdArrowForwardIos />
          </div>
          <div>
            <img src="images/infinity.png" width="150px" height="200px" />
          </div>
        </div>

        {list === "Newtask-with-reminder" && (
          <div className="newtask-container">
            <Paper elevation={4} className="task-from-paper">
              <Typography
                variant="h4"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                📝 𝐀ᑯᑯ 𝖺 𝐍𝖾𝗐 𝐓α𝗌𝗄…
              </Typography>
              <div
                className="newtask-inputs"
                style={{
                  width: "400px",
                  height: "350px",
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Task Name"
                  variant="outlined"
                  name="taskname"
                  required
                  value={newtask.taskname}
                  onChange={(e) =>
                    setNewtask({ ...newtask, taskname: e.target.value })
                  }
                />

                <ForDateandTime
                  defaultDate={newtask.taskdate}
                  onDateChange={(date) =>
                    setNewtask({ ...newtask, taskdate: date })
                  }
                  onTimeChange={(time) =>
                    setNewtask({ ...newtask, tasktime: time })
                  }
                />

                <TextField
                  label="Description"
                  variant="outlined"
                  name="taskdescription"
                  required
                  value={newtask.taskdescription}
                  onChange={(e) =>
                    setNewtask({ ...newtask, taskdescription: e.target.value })
                  }
                  fullWidth
                  multiline
                  maxRows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      paddingTop: "16px",
                      paddingBottom: "0",
                      paddingLeft: "0",
                      paddingRight: "0",
                      "& textarea": {
                        height: "84px",
                        overflow: "auto",
                        padding: "8px",
                        boxSizing: "border-box",
                      },
                    },
                  }}
                  style={{ marginBottom: "70px" }}
                />
              </div>
            </Paper>

            <div className="additional-details">
              <Paper>
                <Box component="section" className="image-box">
                  {newtask.image ? (
                    <FaCheck color="green" size={24} />
                  ) : (
                    <FaPlus onClick={handleplus} size={24} />
                  )}
                </Box>
              </Paper>
              <Button
                variant="contained"
                className="done-botton"
                onClick={handlesave}
              >
                Done
              </Button>
            </div>
          </div>
        )}
        {list === "continuous-reminder" && (
          <div className="newtask-container">
            {!recurrenceType ? (
              <Paper elevation={4} className="simple-form">
                <Typography variant="h6" align="center">
                  𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗽𝗿𝗲𝗳𝗲𝗿𝗿𝗲𝗱 𝗿𝗲𝗺𝗶𝗻𝗱𝗲𝗿 𝗳𝗿𝗲𝗾𝘂𝗲𝗻𝗰𝘆
                </Typography>
                {["daily", "weekly", "monthly", "yearly", "interval"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={() => setRecurrenceType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  )
                )}
              </Paper>
            ) : (
              <Paper elevation={4} className="simple-form">
                <Typography variant="h6" align="center">
                  {recurrenceType === "daily" && "🕒 Daily Reminder"}
                  {recurrenceType === "weekly" && "📅 Weekly Reminder"}
                  {recurrenceType === "monthly" && "🗓 Monthly Reminder"}
                  {recurrenceType === "yearly" && "🎉 Yearly Reminder"}
                  {recurrenceType === "interval" && "⏱ Interval Reminder"}
                </Typography>

                <TextField
                  label="Task Name"
                  fullWidth
                  required
                  size="small"
                  value={newtask.taskname}
                  onChange={(e) =>
                    setNewtask({ ...newtask, taskname: e.target.value })
                  }
                />

                {/* Time or Special Inputs */}
                {recurrenceType === "daily" && (
                  <TextField
                    label="Time"
                    type="time"
                    fullWidth
                    size="small"
                    value={newtask.tasktime}
                    onChange={(e) =>
                      setNewtask({ ...newtask, tasktime: e.target.value })
                    }
                  />
                )}

                {recurrenceType === "weekly" && (
                  <>
                    <Typography variant="subtitle2">Select Days</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        justifyContent: "center",
                      }}
                    >
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day) => (
                        <Button
                          key={day}
                          size="small"
                          variant={
                            newtask.days?.includes(day)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => {
                            const selectedDays = newtask.days || [];
                            setNewtask({
                              ...newtask,
                              days: selectedDays.includes(day)
                                ? selectedDays.filter((d) => d !== day)
                                : [...selectedDays, day],
                            });
                          }}
                        >
                          {day.slice(0, 3)} {/* short form */}
                        </Button>
                      ))}
                    </Box>
                    <TextField
                      label="Time"
                      type="time"
                      fullWidth
                      size="small"
                      value={newtask.tasktime}
                      onChange={(e) =>
                        setNewtask({ ...newtask, tasktime: e.target.value })
                      }
                    />
                  </>
                )}

                {recurrenceType === "monthly" && (
                  <>
                    <TextField
                      label="Day of Month (1–31)"
                      type="number"
                      fullWidth
                      size="small"
                      value={newtask.dayOfMonth || ""}
                      onChange={(e) =>
                        setNewtask({ ...newtask, dayOfMonth: e.target.value })
                      }
                    />
                    <TextField
                      label="Time"
                      type="time"
                      fullWidth
                      size="small"
                      value={newtask.tasktime}
                      onChange={(e) =>
                        setNewtask({ ...newtask, tasktime: e.target.value })
                      }
                    />
                  </>
                )}

                {recurrenceType === "yearly" && (
                  <>
                    <TextField
                      label="Month (1–12)"
                      type="number"
                      fullWidth
                      size="small"
                      inputProps={{ min: 1, max: 12 }}
                      value={newtask.month || ""}
                      onChange={(e) =>
                        setNewtask({ ...newtask, month: e.target.value })
                      }
                    />
                    <TextField
                      label="Day of Month (1–31)"
                      type="number"
                      fullWidth
                      size="small"
                      inputProps={{ min: 1, max: 31 }}
                      value={newtask.dayOfMonth || ""}
                      onChange={(e) =>
                        setNewtask({ ...newtask, dayOfMonth: e.target.value })
                      }
                    />
                    <TextField
                      label="Time"
                      type="time"
                      fullWidth
                      size="small"
                      value={newtask.tasktime}
                      onChange={(e) =>
                        setNewtask({ ...newtask, tasktime: e.target.value })
                      }
                    />
                  </>
                )}

                {recurrenceType === "interval" && (
                  <TextField
                    label="Interval (e.g., every 1 hour)"
                    fullWidth
                    size="small"
                    value={newtask.tasktime}
                    onChange={(e) =>
                      setNewtask({ ...newtask, tasktime: e.target.value })
                    }
                  />
                )}

                {/* Description */}
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={newtask.taskdescription}
                  onChange={(e) =>
                    setNewtask({ ...newtask, taskdescription: e.target.value })
                  }
                />

                {/* Image */}
                <Box
                  component="section"
                  className="image-box"
                  sx={{
                    border: "1px dashed #ccc",
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                  onClick={handleplus}
                >
                  {newtask.image ? (
                    <FaCheck color="green" size={20} />
                  ) : (
                    <FaPlus size={20} />
                  )}
                </Box>

                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginTop: "8px",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setRecurrenceType("")}
                  >
                    Back
                  </Button>
                  <Button variant="contained" size="small" onClick={handlesave}>
                    Done
                  </Button>
                </Box>
              </Paper>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default NewTask;
