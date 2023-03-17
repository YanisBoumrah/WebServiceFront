import React from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import Header from './components/Header';
import Footer from './components/Footer';

const data = {
  "databases": [
    {
      "id": 1,
      "name": "example_db",
      "tables": [
        {
          "id": 1,
          "name": "customers",
          "columns": [
            "id",
            "name",
            "email",
            "phone"
          ],
          "rows": [
            {
              "id": 1,
              "data": {
                "id": 1,
                "name": "John Doe",
                "email": "johndoe@example.com",
                "phone": "555-1234"
              }
            },
            {
              "id": 2,
              "data": {
                "id": 2,
                "name": "Jane Smith",
                "email": "janesmith@example.com",
                "phone": "555-5678"
              }
            }
          ]
        },
        {
          "id": 2,
          "name": "orders",
          "columns": [
            "id",
            "customer_id",
            "product",
            "price"
          ],
          "rows": [
            {
              "id": 1,
              "data": {
                "id": 1,
                "customer_id": 1,
                "product": "Widget",
                "price": 10.0
              }
            },
            {
              "id": 2,
              "data": {
                "id": 2,
                "customer_id": 2,
                "product": "Gadget",
                "price": 20.0
              }
            }
          ]
        }
      ]
    }
  ]};
  
  const Wrapper = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    background-color: #f7f7f7;
    min-height: 100vh;
    padding: 20px;
  `;
  
  function App() {
    const [selectedDatabase, setSelectedDatabase] = React.useState(null);
    const [selectedTable, setSelectedTable] = React.useState(null);
  
    return (
      <>
      <Header/>
      <Wrapper>
        <Sidebar
          data={data}
          selectedDatabase={selectedDatabase}
          setSelectedDatabase={setSelectedDatabase}
          setSelectedTable={setSelectedTable}
        />
        <MainView selectedTable={selectedTable} />
      </Wrapper>
      <Footer/>
      </>
    );
  }
  
  export default App;
  