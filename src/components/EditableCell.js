import React, { useState, useRef, useEffect } from "react";

const EditableCell = ({ value, onValueChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value || ""); // Add a conditional check here
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    onValueChange(editedValue);
    setIsEditing(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      value={editedValue}
      onChange={(e) => setEditedValue(e.target.value)}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  ) : (
    <span onClick={() => setIsEditing(true)}>
      {value === null || value === "" ? "-" : value} {/* Add a conditional check to display "-" for null or empty string values */}
    </span>
  );
};

export default EditableCell;
