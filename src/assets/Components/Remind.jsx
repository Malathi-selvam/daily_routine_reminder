import React, { useEffect } from "react";
import emailjs from "@emailjs/browser";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function Remind() {
  useEffect(() => {
    const interval = setInterval(() => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser || !loggedInUser.email) return;

      const emailKey = `tasks_${loggedInUser.email}`;
      const storedTasks = JSON.parse(localStorage.getItem(emailKey)) || [];

      const now = dayjs();
      const nowDate = now.format("YYYY-MM-DD");
      const nowDayOfWeek = now.format("dddd"); // Sunday, Monday, etc.
      const nowDayOfMonth = now.date(); // 1-31
      const nowMonth = now.month() + 1; // 1-12

      storedTasks.forEach(async (task, index) => {
        if (!task.tasktime) return;
        if (task.recurrence === "once" && task.notified) return;
        if (task.stopped) return;

        const recurrence = task.recurrence || "once";
        let shouldNotify = false;

        const lastNotified = task.lastNotified
          ? dayjs(task.lastNotified)
          : null;

        // Avoid spamming for non-interval tasks
        if (
          recurrence !== "interval" &&
          lastNotified &&
          now.diff(lastNotified, "minute") < 60
        ) {
          return;
        }

        // Evaluate whether this task should notify now
        switch (recurrence) {
          case "daily":
            if (now.format("HH:mm") === task.tasktime) {
              shouldNotify = true;
            }
            break;

          case "weekly":
            if (
              task.days &&
              task.days.includes(nowDayOfWeek) &&
              now.format("HH:mm") === task.tasktime
            ) {
              shouldNotify = true;
            }
            break;

          case "monthly":
            if (
              Number(task.dayOfMonth) === nowDayOfMonth &&
              now.format("HH:mm") === task.tasktime
            ) {
              shouldNotify = true;
            }
            break;

          case "yearly":
            if (
              Number(task.month) === nowMonth &&
              Number(task.dayOfMonth) === nowDayOfMonth &&
              now.format("HH:mm") === task.tasktime
            ) {
              shouldNotify = true;
            }
            break;

          case "interval":
            if (!lastNotified) {
              shouldNotify = true;
            } else {
              const intervalMinutes = parseInterval(task.tasktime);
              if (
                intervalMinutes &&
                now.diff(lastNotified, "minute") >= intervalMinutes
              ) {
                shouldNotify = true;
              }
            }
            break;

          default:
            // One-time tasks
            if (task.taskdate === nowDate) {
              const taskTime = dayjs(`${nowDate}T${task.tasktime}`);
              if (Math.abs(now.diff(taskTime, "minute")) <= 1) {
                shouldNotify = true;
              }
            }
            break;
        }

        // Debug log
        console.log(
          `[DEBUG] ${task.taskname} - recurrence: ${recurrence}, shouldNotify: ${shouldNotify}, lastNotified: ${
            lastNotified ? lastNotified.format() : "never"
          }, now: ${now.format()}`
        );

        if (shouldNotify) {
          console.log(`⏰ Sending reminder for task: ${task.taskname}`);
          const templateParams = {
            to_name: loggedInUser?.name || "User",
            task_name: task.taskname,
            task_description: task.taskdescription,
            task_date: task.taskdate || "",
            task_time: task.tasktime,
            to_email: loggedInUser?.email,
          };

          try {
            await emailjs.send(
              "service_gezt1yq",
              "template_kf0ugnr",
              templateParams,
              "P7h3jtxgUZc-m9DKf"
            );
            storedTasks[index].lastNotified = now.toISOString();
            if (recurrence === "once") {
              storedTasks[index].notified = true;
            }
            localStorage.setItem(emailKey, JSON.stringify(storedTasks));
            toast.success(`✅ Reminder sent for: ${task.taskname}`);
          } catch (error) {
            console.error("❌ Failed to send reminder email:", error);
            toast.error("❌ Failed to send reminder email.");
          }
        }
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return null;
}

// Helper: parse "every 1 hour"/"every 5 minutes"
function parseInterval(str) {
  if (!str) return null;
  const match = str.match(/(?:every\s*)?(\d+)\s*(minute|hour)/i);
  if (!match) return null;
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  return unit === "hour" ? amount * 60 : amount;
}

export default Remind;
