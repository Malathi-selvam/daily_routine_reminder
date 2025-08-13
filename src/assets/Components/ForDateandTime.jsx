import * as React from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useState } from "react";

function ForDateandTime({ onDateChange, onTimeChange }) {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(null);

  const isToday = date.isSame(dayjs(), "day");
  const now = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
              if (newDate) {
                onDateChange(newDate.format("YYYY-MM-DD"));
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TimePicker
          label="Select Time"
          value={time}
          onChange={(newTime) => {
            setTime(newTime);
            if (onTimeChange && newTime) {
              onTimeChange(newTime.format("HH:mm"));
            }
          }}
          minTime={isToday ? now : undefined}
          renderInput={(params) => <TextField {...params} required />}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default ForDateandTime;
