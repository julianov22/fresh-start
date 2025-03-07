import './App.css';
import firebaseApp from './firebase';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

// Initialize Firestore
const db = getFirestore(firebaseApp);

function App() {
  const [assistants, setAssistants] = useState([]);
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    picture: '',
  });

  // Fetch assistants data
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assistants'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssistants(data);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      }
    };
    fetchAssistants();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssistant(prev => ({ ...prev, [name]: value }));
  };

  // Add new assistant to Firestore
  const addAssistant = async () => {
    if (newAssistant.name && newAssistant.picture) {
      try {
        const docRef = await addDoc(collection(db, 'assistants'), {
          ...newAssistant,
          creationDate: new Date(),
        });
        console.log('Document written with ID:', docRef.id);
        setAssistants(prev => [...prev, { ...newAssistant, id: docRef.id, creationDate: new Date() }]);
        setNewAssistant({ name: '', picture: '' });  // Clear form
      } catch (error) {
        console.error('Error adding document:', error);
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

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
              <th>Creation Date</th>
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

        <h2>Add New Assistant</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newAssistant.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="picture"
          placeholder="Picture URL"
          value={newAssistant.picture}
          onChange={handleChange}
        />
        <button onClick={addAssistant}>Add Assistant</button>
      </div>
    </div>
  );
}

export default App;