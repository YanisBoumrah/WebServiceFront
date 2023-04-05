import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsDatabaseFillAdd ,BsTrash} from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import {GrTableAdd} from "react-icons/gr";
import { BiEdit } from "react-icons/bi";
import axios from "axios";



const SidebarContainer = styled.div`
  background-color: #FFF; ;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  width: 250px;
  height: 100%;
  overflow-y: auto;
  position: sticky;
  overflow: hidden;
`;

const DatabaseItem = styled.div`
  cursor: pointer;
  padding: 10px 0;
  display: flex;
  align-items: center;
  ${({ isSelected }) =>
    isSelected &&
    `
    font-weight: bold;
    color: #009879;
  `}
`;

const IconHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TableItem = styled.div`
  cursor: pointer;
  padding: 5px 0 5px 20px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f7f7f7;
  }
`;
const SectionTitle = styled.h3`
  margin: 0;
  padding: 0 0 10px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: transparent;
  color: #009879;
  border: none;
  font-size: 1.2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #007b63;
  }
`;

const RecycleBinButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.2em;
  color: #909090;
  cursor: pointer;

  &:hover {
    color: #707070;
  }
`;
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalContent = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
`;

const ModifyButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.2em;
  color: #909090;
  cursor: pointer;

  &:hover {
    color: #707070;
  }
`;
const ModalButton = styled.button`
  background-color: ${(props) => (props.primary ? "#009879" : "#ccc")};
  color: #fff;
  padding: 10px;
  margin-right: ${(props) => (props.primary ? "10px" : "0")};
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const Modal = ({ show, onClose, onSave,initialValue  }) => {
  const [inputValue, setInputValue] = useState(initialValue || "");

  const handleSave = () => {
    onSave(inputValue);
    setInputValue("");
    onClose();
  };

  const handleCancel = () => {
    setInputValue("");
    onClose();
  };
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  if (!show) return null;

  return (
    <ModalContainer>
      <ModalContent>
        <ModalInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter name"
        />
        <div>
          <ModalButton primary onClick={handleSave}>
            Save
          </ModalButton>
          <ModalButton onClick={handleCancel}>Cancel</ModalButton>
        </div>
      </ModalContent>
    </ModalContainer>
  );
};

const Sidebar = ({
  selectedDatabase,
  setSelectedDatabase,
  setSelectedTable,
}) => {
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = () => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        if (Array.isArray(response.data.databases)) {
          const databasesArray = response.data.databases.map(
            (dbName, index) => {
              return { id: index, name: dbName };
            }
          );
          setDatabases(databasesArray);

          // Fetch tables for the first database
          if (databasesArray.length > 0) {
            const firstDatabase = databasesArray[0];
            setSelectedDatabase(firstDatabase);
            fetchTables(firstDatabase.name);
          }
        } else {
          console.error("Received data is not an object:", response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch databases:", error);
      });
  };

  const fetchTables = (databaseName) => {
    console.log(`http://127.0.0.1:8000/${databaseName}`);
    if (!databaseName) {
      console.error("Database name is undefined");
      return;
    }
    axios
      .get(`http://127.0.0.1:8000/${databaseName}`)
      .then((response) => {
        console.log("Fetched tables:", response.data);
        if (response.data && typeof response.data === "object") {
          const tablesArray = response.data.collections.map(
            (tableName, index) => {
              return { id: index, name: tableName };
            }
          );
          setTables(tablesArray);

          // Fetch collections for each table
          tablesArray.forEach((table) => {
            fetchCollections(databaseName, table.name);
          });
        } else {
          console.error("Received data is not an object:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching tables:", error));
  };

  const fetchCollections = (databaseName, tableName) => {
    console.log(`http://127.0.0.1:8000/${databaseName}/${tableName}`)
    axios
      .get(`http://127.0.0.1:8000/${databaseName}/${tableName}`)
      .then((response) => {
        console.log("Fetched collections:", response.data.documents);
        // Handle the fetched collections data here
      })
      .catch((error) => console.error("Error fetching collections:", error));
  };

  const handleDatabaseClick = (database) => {
    if (selectedDatabase === database) {
      setSelectedDatabase(null);
      setSelectedTable(null);
    } else {
      setSelectedDatabase(database);
      fetchTables(database.name);
    }
  };

  const createDatabase = (name) => {
    const body = {
      dbName: name,
    };
    if (!body) {
      alert("Please enter a database name");
    } else {
      try {
        console.log("Accuut");

        axios
          .post("http://127.0.0.1:8000/", JSON.stringify(body))
          .then((response) => {
            console.log("Database created:", response.data);
            fetchDatabases();
          })
          .catch((error) => console.error("Error creating database:", error));
      } catch (error) {
        console.log("it is an error", error.toString());
      }
    }
  };

  const createTable = (name) => {
    const body = {
      collectionName: name,
    };
    axios
      .post(
        `http://127.0.0.1:8000/${selectedDatabase.name}`,
        JSON.stringify(body)
      )
      .then((response) => {
        console.log("Table created:", response.data);
        fetchTables(selectedDatabase.name);
      })
      .catch((error) => console.error("Error creating table:", error));
  };
  const updateDatabase = (oldName, newName) => {
    const body = {
      newName: newName,
    };
    axios
      .put(`http://127.0.0.1:8000/${oldName}`, JSON.stringify(body))
      .then((response) => {
        console.log("Database updated:", response.data);
        fetchDatabases();
      })
      .catch((error) => console.error("Error updating database:", error));
  };

  const updateTable = (databaseName, oldName, newName) => {
    const body = {
      newCollectionName: newName,
    };
    axios
      .put(
        `http://127.0.0.1:8000/${databaseName}/${oldName}`,
        JSON.stringify(body)
      )
      .then((response) => {
        console.log("Table updated:", response.data);
        fetchTables(databaseName);
      })
      .catch((error) => console.error("Error updating table:", error));
  };



  const handleAddDatabaseClick = () => {
    console.log("Add database");
    setModalType("database");
    setShowModal(true);
  };

  const handleAddTableClick = (database) => {
    console.log("Add table to", database.name);
    setModalType("table");
    setShowModal(true);
  };

  const handleModifyDatabaseClick = (database) => {
    console.log("Modify database:", database.name);
    setModalType("database");
    setEditedItem(database);
    setShowModal(true);
  };

  const handleModifyTableClick = (table) => {
    console.log("Modify table:", table.name);
    setModalType("table");
    setEditedItem(table);
    setShowModal(true);
  };


  
  
  const handleDeleteDatabaseClick = (database) => {
    const url = `http://127.0.0.1:8000/${database.name}`
    console.log(url)
    // const url = `http://127.0.0.1:8000/Clients`
    console.log("Delete database:", database.name);
    axios
      .delete(url)
      .then((response) => {
        console.log("Database deleted:", response.data);
        fetchDatabases(); // fetch updated database list
      })
      .catch((error) => console.error("Error deleting database:", error));
  };
  
  const handleDeleteTableClick = (table) => {
    console.log("Delete table:", table.name);
    axios
      .delete(`http://127.0.0.1:8000/${selectedDatabase.name}/${table.name}`)
      .then((response) => {
        console.log("Table deleted:", response.data);
        fetchTables(selectedDatabase.name); // fetch updated table list
      })
      .catch((error) => console.error("Error deleting table:", error));
  };
  const handleSave = (name) => {
    if (modalType === "database") {
      if (editedItem) {
        console.log("Update database:", name);
        updateDatabase(editedItem.name, name);
      } else {
        console.log("Save database:", name);
        createDatabase(name);
      }
    } else if (modalType === "table") {
      if (editedItem) {
        console.log("Update table:", name);
        updateTable(selectedDatabase.name, editedItem.name, name);
      } else {
        console.log("Save table:", name);
        createTable(name);
      }
    }
    setEditedItem(null);
    setShowModal(false);
  };
  return (
    <SidebarContainer>
      <SectionTitle>
        Databases
        <AddButton onClick={handleAddDatabaseClick}>
          <BsDatabaseFillAdd size={15} />
        </AddButton>
      </SectionTitle>
      {databases.map((database, index) => (
        <React.Fragment key={database.id}>
          <DatabaseItem
            key={index} // Ajout de la clé unique
            database={database}
            isSelected={selectedDatabase === database}
            onClick={() => handleDatabaseClick(database)}
          >
            {database.name}
            <IconHolder>
              <AddButton
                onClick={() => {
                  handleAddTableClick(database);
                }}
              >
                <IoMdAdd size={15} />
             
              <ModifyButton
              onClick={() => {
                handleModifyDatabaseClick(database);
              }}
            >
              <BiEdit size={15} />
            </ModifyButton>
            </AddButton>
              <RecycleBinButton
                onClick={() => {
                  handleDeleteDatabaseClick(database);
                }}
              >
                <BsTrash size={15} />
              </RecycleBinButton>
            </IconHolder>
          </DatabaseItem>
          {selectedDatabase === database &&
            tables.map((table, index) => (
              <TableItem
                key={index}
                onClick={() => {
                  setSelectedTable(table);
                  fetchCollections(database.name, table.name);
                }}
              >
                <GrTableAdd style={{margin : '0 5px 0 0', fontSize: "1.5em"}}/>
                {table.name}
                <IconHolder>
                <ModifyButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModifyTableClick(table);
                  }}
                >
                  <BiEdit size={15} />
                </ModifyButton>
                  <p> </p>

                  <RecycleBinButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTableClick(table);
                    }}
                  >
                    <BsTrash size={15} />
                  </RecycleBinButton>
                </IconHolder>
              </TableItem>
            ))}
        </React.Fragment>
      ))}
      <Modal
  show={showModal}
  onClose={() => setShowModal(false)}
  onSave={handleSave}
/>
    </SidebarContainer>
  );
};

export default Sidebar;
