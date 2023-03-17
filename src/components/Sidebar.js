import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  background-color: #333;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  width: 250px;
  height: calc(100vh - 200px); 
  overflow-y: auto;
  position: sticky;
  top: 70px;
`;

const SidebarItem = styled.div`
  color: #fff;
  cursor: pointer;
  margin-bottom: 5px;
  &:hover {
    color: #009879;
  }
`;

const Sidebar = ({ data, selectedDatabase, setSelectedDatabase, setSelectedTable }) => {
    const handleDatabaseClick = (database) => {
        if (selectedDatabase === database) {
          setSelectedDatabase(null);
          setSelectedTable(null);
        } else {
          setSelectedDatabase(database);
          setSelectedTable(null);
        }
      };
      

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  return (
    <SidebarContainer>
      {data.databases.map((database) => (
        <React.Fragment key={database.id}>
          <SidebarItem onClick={() => handleDatabaseClick(database)}>
            {database.name}
          </SidebarItem>
          {selectedDatabase === database &&
            database.tables.map((table) => (
              <SidebarItem
                key={table.id}
                style={{ marginLeft: "10px" }}
                onClick={() => handleTableClick(table)}
              >
                {table.name}
              </SidebarItem>
            ))}
        </React.Fragment>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
