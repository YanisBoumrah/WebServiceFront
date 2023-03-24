import React from 'react';
import styled from 'styled-components';
import TableView from './TableView';

const MainViewContainer = styled.div`
  flex: 1;
  padding: 20px;
  min-height: 100vh;
`;

const MainView = ({ selectedTable, selectedDatabase }) => {
  return (
    <MainViewContainer>
      {selectedTable && selectedDatabase && (
        <TableView selectedDatabase={selectedDatabase} selectedTable={selectedTable} />
      )}
    </MainViewContainer>
  );
};

export default MainView;
