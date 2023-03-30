import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import EditableCell from "./EditableCell";

const Table = styled.table`
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 0.9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
  }
  th,
  td {
    padding: 12px 15px;
  }
  tbody tr {
    border-bottom: 1px solid #dddddd;
  }
  tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }
`;

const AddButton = styled.button`
  border: none;
  color: #009879;
  font-size: 1.2rem; // Smaller font size
  font-weight: bold;
  text-align: center;
`;

const CreateButton = styled.button`
  background-color: #009879;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  &:hover {
    background-color: #007f67;
  }
`;
const FieldInput = styled.input`
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 5px;
  width: auto;
  box-sizing: border-box;
`;

const TableView = ({ selectedDatabase, selectedTable }) => {
  const [collections, setCollections] = useState([]);
  const [newFields, setNewFields] = useState([]);
  const [maxFields, setMaxFields] = useState(null);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`
      );
      setCollections(response.data);
      console.log('',response.data)

      // Update maxFields when collections are fetched
      if (
        response.data &&
        response.data.documents &&
        Object.keys(response.data.documents).length > 0
      ) {
        const firstDocument =
          response.data.documents[Object.keys(response.data.documents)[0]];
        setMaxFields(Object.keys(firstDocument).length);
      } else {
        setMaxFields(null);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };
  const addField = () => {
    if (!maxFields || newFields.length < maxFields) {
      setNewFields([...newFields, { key: "", value: "" }]);
    } else {
      alert(`You can't add more than ${maxFields} fields.`);
    }
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...newFields];
    updatedFields[index] = { key, value };
    setNewFields(updatedFields);
  };

  const createNewDocument = async () => {
    const newDocument = newFields.reduce((doc, field) => {
      doc[field.key] = field.value;
      console.log(doc);
      return doc;
    }, {});

    try {
      await axios.post(
        `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`,
        JSON.stringify(newDocument)
      );
      alert("Document created");
      setNewFields([]);
      fetchCollections();
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`
        );
        setCollections(response.data);
        console.log('',response.data)
  
        // Update maxFields when collections are fetched
        if (
          response.data &&
          response.data.documents &&
          Object.keys(response.data.documents).length > 0
        ) {
          const firstDocument =
            response.data.documents[Object.keys(response.data.documents)[0]];
          setMaxFields(Object.keys(firstDocument).length);
        } else {
          setMaxFields(null);
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };
  
    if (selectedDatabase && selectedTable) {
      fetchCollections();
    }
  }, [selectedDatabase, selectedTable]);

  return (
    <>
      <h3>Table: {selectedTable.name}</h3>
      <Table>
        <thead>
          <tr>
            {collections &&
            collections.documents &&
            Object.keys(collections.documents).length > 0 ? (
              Object.keys(
                collections.documents[Object.keys(collections.documents)[0]]
              ).map((key) => <th key={key.id}>{key}</th>)
            ) : (
              <tr>
                <td colSpan="100%">No collections found.</td>
              </tr>
            )}
          </tr>
        </thead>

        <tbody>
          {collections && collections.documents ? (
            Object.values(collections.documents).map((row) => (
              <tr key={row.id}>
                {row &&
                  Object.keys(row).map((column) => (
                    <td key={column}>
                      <EditableCell
                        value={row[column]}
                        onValueChange={(newValue) =>
                          console.log("Handle cell value change", newValue)
                        }
                      />
                    </td>
                  ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="100%">No collections found.</td>
            </tr>
          )}
        </tbody>
      </Table>
          <AddButton onClick={addField}>+</AddButton>
          {newFields.map((field, index) => (
            <div key={index}>
              <FieldInput
                value={field.key}
                onChange={(e) =>
                  handleFieldChange(index, e.target.value, field.value)
                }
                placeholder="Key"
              />
              <FieldInput
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(index, field.key, e.target.value)
                }
                placeholder="Value"
              />
            </div>
          ))}
        
        <CreateButton onClick={createNewDocument}>Create document</CreateButton>{" "}
    </>
  );
};

export default TableView;
