import React, { useState, useRef, useEffect } from "react";

const EditableCell = ({ value, onValueChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
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
    <span onClick={() => setIsEditing(true)}>{value}</span>
  );
};

export default EditableCell;
