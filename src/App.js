import './App.css';
import firebaseApp from './firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

// Initialize Firestore
const db = getFirestore(firebaseApp);

function App() {
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assistants'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssistants(data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };
    fetchAssistants();
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <div style={{ padding: '20px' }}>
          <h3>Firebase Connected</h3>
          <p>Your app is now connected to Firebase project: test-app-9fb7e</p>
        </div>
      </div>
      <div className="main-content">
        <h1>Assistants</h1>
        <table border="1" style={{ margin: '20px', width: '80%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Picture</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {assistants.map(assistant => (
              <tr key={assistant.id}>
                <td>{assistant.name}</td>
                <td>
                  <img 
                    src={assistant.picture} 
                    alt={assistant.name} 
                    width="50" 
                    style={{ borderRadius: '5px' }} 
                  />
                </td>
                <td>{new Date(assistant.creationDate.seconds * 1000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;