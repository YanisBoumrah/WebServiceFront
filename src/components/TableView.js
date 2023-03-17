import React from 'react';
import styled from 'styled-components';
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

const TableView = ({ table, data, onDataChange }) => {
    const handleCellValueChange = (rowId, column, newValue) => {
      const updatedData = JSON.parse(JSON.stringify(data));
      const database = updatedData.databases.find((db) => db.tables.includes(table));
      const rowIndex = table.rows.findIndex((row) => row.id === rowId);
  
      if (rowIndex !== -1) {
        table.rows[rowIndex].data[column] = newValue;
        onDataChange(updatedData);
      }
    };
      
  return (
    <React.Fragment>
      <h3>Table: {table.name}</h3>
      <Table>
        <thead>
          <tr>
            {table.columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
      {table.rows.map((row) => (
        <tr key={row.id}>
          {table.columns.map((column, index) => (
            <td key={index}>
              <EditableCell
                value={row.data[column]}
                onValueChange={(newValue) => handleCellValueChange(row.id, column, newValue)}
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
