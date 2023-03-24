import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EditableCell from './EditableCell';

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
  th, td {
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

const TableView = ({ selectedDatabase, selectedTable }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/${selectedDatabase.name}/${selectedTable.name}`
        );
        setCollections(response.data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };

    if (selectedDatabase && selectedTable) {
      fetchCollections();
    }
  }, [selectedDatabase, selectedTable]);

  return (
    <React.Fragment>
      <h3>Table: {selectedTable.name}</h3>
      <Table>
        <thead>
          <tr>
            {/* Replace "column" with the appropriate property from your data structure */}
            {collections.map((column, index) => (
              <th key={index}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Replace "row" and "data" with the appropriate properties from your data structure */}
          {collections.map((row) => (
            <tr key={row.id}>
              {collections.map((column, index) => (
                <td key={index}>
                  <EditableCell
                    value={row.data[column.name]}
                    onValueChange={(newValue) =>
                      console.log('Handle cell value change', newValue)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default TableView;
