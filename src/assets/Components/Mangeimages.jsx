import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { FaPlus } from "react-icons/fa";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

function Manageimages() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:4000/images")
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        if (data.length > 0) {
          setSelectedImageId(data[0].id);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);
  const handleclick = (id) => {
    const selectedImage = images.find((img) => img.id === id);

    console.log("Navigating to /NewTask with:", {
      currentTask: location.state?.currentTask,
      selectedImage: selectedImage,
      previousList: location.state.previousList,
      previousRecurrenceType: location.state.previousRecurrenceType,
    });

    toast.success("Successfully selected!");

    navigate("/NewTask", {
      state: {
        selectedImage: selectedImage,
        currentTask: location.state.currentTask,
        previousList: location.state.previousList,
        previousRecurrenceType: location.state.previousRecurrenceType,
      },
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = {
          id: Date.now(),
          url: reader.result,
        };
        setImages((prev) => [...prev, newImage]);
        setSelectedImageId(newImage.id);
        toast.success("Successfully selected");
        navigate("/NewTask", { state: { selectedImage: newImage } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="image-bar">
        <AppBar position="static" sx={{ backgroundColor: "  #E07A8E" }}>
          <Toolbar>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                color: "#333333",
                fontFamily: "Roboto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Select Image
            </Typography>

            <FaPlus
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer", color: "#333" }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Toolbar>
        </AppBar>
      </Box>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className="manage-scroll-wrapper">
        <section
          className="images"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {images.map((eachimage) => (
            <div
              key={eachimage.id}
              style={{
                width: "250px",
                height: "200px",
                overflow: "hidden",
                borderRadius: "4px",
                marginLeft: "30px",
                cursor: "pointer",
                border:
                  selectedImageId === eachimage.id ? "3px solid blue" : "none",
                boxSizing: "border-box",
                transition: "transform 0.2s, border 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handleclick(eachimage.id)}
            >
              <img
                src={eachimage.url}
                alt={`Image ${eachimage.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export default Manageimages;
