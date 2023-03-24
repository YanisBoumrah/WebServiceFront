import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';

const Wrapper = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  background-color: #f7f7f7;
  min-height: 100vh;
  padding: 20px;
`;

function App() {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [data, setData] = useState({ databases: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        <Sidebar
          data={data}
          selectedDatabase={selectedDatabase}
          setSelectedDatabase={setSelectedDatabase}
          setSelectedTable={setSelectedTable}
        />
        <MainView selectedTable={selectedTable} selectedDatabase={selectedDatabase} />
      </Wrapper>
      <Footer />
    </>
  );
}

export default App;
