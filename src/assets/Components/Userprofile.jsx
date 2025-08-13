import React, { useState, useEffect } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";

function Userprofile() {
  const [showDetails, setShowDetails] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={handleClick}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <RiAccountPinCircleFill size={40} />
      </div>
      {showDetails && currentUser && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: 0,
            background: "#D3D3D380",
            color: "black",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
            minWidth: "150px",
          }}
        >
          <div>
            <strong></strong> {currentUser.Name}
          </div>
          <div>
            <strong></strong> {currentUser.email}
          </div>
        </div>
      )}
    </div>
  );
}

export default Userprofile;
