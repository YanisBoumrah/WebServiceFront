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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 20px;
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

  const operators = [
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: ">=", label: ">=" },
    { value: "!=", label: "Diff" },
    { value: "=", label: "Egale" },
  ];

  const [searchConditions, setSearchConditions] = useState([
    { key: "", operator: ">", term: "" },
  ]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`
      );
      setCollections(response.data);
      console.log("", response.data);

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

  const searchDocuments = async () => {
    try {
      const query = searchConditions
        .filter(
          (condition) => condition.key && condition.operator && condition.term
        )
        .map(
          (condition, index) =>
            `${condition.key}${condition.operator}${condition.term}${
              index < searchConditions.length - 1 ? "&" : ""
            }`
        )
        .join("");

      console.log("je suis la query", query);
      if (query) {
        const response = await axios.get(
          `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}?${query}`
        );
        console.log("response", response);
        setCollections({ documents: response.data });
      }
    } catch (error) {
      console.error("Failed to search documents:", error);
    }
  };

  const addSearchField = () => {
    setSearchConditions([
      ...searchConditions,
      { key: "", operator: ">", term: "" },
    ]);
  };
  const deleteSearchField = (index) => {
    const updatedConditions = [...searchConditions];
    updatedConditions.splice(index, 1);
    setSearchConditions(updatedConditions);
  };
  const ResetTable = () => {
    fetchCollections();
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

  const updateDocumentAttribute = async (id, attribute, value) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}/${id}?${attribute}=${value}`
      );
      fetchCollections();
    } catch (error) {
      console.error("Failed to update document attribute:", error);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`
        );
        setCollections(response.data);
  
        // Update search conditions with the first key by default
        if (
          response.data &&
          response.data.documents &&
          Object.keys(response.data.documents).length > 0
        ) {
          const firstDocument =
            response.data.documents[Object.keys(response.data.documents)[0]];
          const firstKey = Object.keys(firstDocument)[0];
          setSearchConditions((prevConditions) => {
            const updatedConditions = [...prevConditions];
            updatedConditions[0].key = firstKey;
            return updatedConditions;
          });
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };
  
    if (selectedDatabase && selectedTable) {
      fetchCollections();
    }
  }, [selectedDatabase, selectedTable]);
  

  // useEffect(() => {
  //   if (
  //     collections &&
  //     collections.documents &&
  //     Object.keys(collections.documents).length > 0
  //   ) {
  //     const firstKey = Object.keys(
  //       collections.documents[Object.keys(collections.documents)[0]]
  //     )[0];

  //     setSearchConditions((prevConditions) => {
  //       const updatedConditions = [...prevConditions];
  //       updatedConditions[0].key = firstKey;
  //       return updatedConditions;
  //     });
  //   }
  // }, [collections]);
  return (
    <>
      <h3>Table: {selectedTable.name}</h3>
      <Container>
        <Table key={Math.random()}>
          <thead>
            <tr key={Math.random()}>
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
              Object.keys(collections.documents).length > 0 ? (
                Object.values(collections.documents).map((row) => (
                  <tr key={row.id}>
                    {row &&
                      Object.keys(row).map((column) => (
                        <td key={column}>
                          <EditableCell
                            value={row[column]}
                            onValueChange={(newValue) =>
                              updateDocumentAttribute(row.id, column, newValue)
                            }
                          />
                        </td>
                      ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="100%">No results found.</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="100%">No collections found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        <SearchContainer>
          {searchConditions.map((condition, index) => (
            <div key={index}>
              {/* Key dropdown */}
              <select
                value={condition.key}
                onChange={(e) => {
                  setSearchConditions((prevConditions) => {
                    const updatedConditions = [...prevConditions];
                    updatedConditions[index].key = e.target.value;
                    return updatedConditions;
                  });
                }}
              >
                {collections &&
                  collections.documents &&
                  Object.keys(collections.documents).length > 0 &&
                  Object.keys(
                    collections.documents[Object.keys(collections.documents)[0]]
                  ).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
              </select>

              {/* Operator dropdown */}
              <select
                value={condition.operator}
                onChange={(e) => {
                  setSearchConditions((prevConditions) => {
                    const updatedConditions = [...prevConditions];
                    updatedConditions[index].operator = e.target.value;
                    return updatedConditions;
                  });
                }}
              >
                {operators.map((operator) => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>

              {/* Search term input */}
              <input
                type="text"
                value={condition.term}
                onChange={(e) => {
                  setSearchConditions((prevConditions) => {
                    const updatedConditions = [...prevConditions];
                    updatedConditions[index].term = e.target.value;
                    return updatedConditions;
                  });
                }}
                placeholder="Search term"
              />
              <button onClick={() => deleteSearchField(index)}>Delete</button>
            </div>
          ))}

          <button onClick={addSearchField}>Add search field</button>
          <button onClick={ResetTable}>reset</button>

          <button onClick={searchDocuments}>Search</button>
        </SearchContainer>
      </Container>
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
