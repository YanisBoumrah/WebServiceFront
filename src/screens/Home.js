import React,{ useState, useEffect }  from 'react';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import data from '../data.json';

const Home = () => {
    const [selectedDb, setSelectedDb] = useState(null);

    const handleDbSelect = (id) => {
      setSelectedDb(id);
    };
  
    const renderSelectedDatabase = () => {
      const selectedDatabase = data.databases.find((db) => db.id === selectedDb);
      if (selectedDatabase) {
        return (
          <>
            <h2>{selectedDatabase.name}</h2>
            {selectedDatabase.tables.map((table) => (
              <div key={table.id}>
                <h3>{table.name}</h3>
                <Table columns={table.columns} rows={table.rows} onRowClick={(id) => console.log(id)} />
              </div>
            ))}
          </>
        );
      } else {
        return <p>Please select a database</p>;
      }
    };
  
    return (
      <div className="app">
        <Sidebar databases={data.databases} selectedDb={selectedDb} onDbSelect={handleDbSelect} />
        <div className="main">
          {renderSelectedDatabase()}
        </div>
      </div>
    );
  };

export default Home;