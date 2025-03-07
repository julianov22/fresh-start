import './App.css';
import firebaseApp from './firebase';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

// Initialize Firestore
const db = getFirestore(firebaseApp);

function App() {
  const [assistants, setAssistants] = useState([]);
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    picture: '',
    creationDate: new Date()
  });
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    picture: ''
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

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Add new assistant to Firestore
  const addAssistant = async () => {
    if (newAssistant.name && newAssistant.picture) {
      try {
        const currentDate = new Date();
        const docRef = await addDoc(collection(db, 'assistants'), {
          name: newAssistant.name,
          picture: newAssistant.picture,
          creationDate: currentDate
        });
        console.log('Document written with ID:', docRef.id);
        setAssistants(prev => [...prev, { 
          id: docRef.id, 
          name: newAssistant.name,
          picture: newAssistant.picture,
          creationDate: currentDate 
        }]);
        setNewAssistant({ 
          name: '', 
          picture: '', 
          creationDate: new Date() 
        });  // Clear form
      } catch (error) {
        console.error('Error adding document:', error);
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  // Delete assistant from Firestore
  const deleteAssistant = async (id) => {
    try {
      await deleteDoc(doc(db, 'assistants', id));
      setAssistants(assistants.filter(assistant => assistant.id !== id));
      console.log('Assistant deleted successfully');
      // If the deleted assistant was selected, clear the selection
      if (selectedAssistant && selectedAssistant.id === id) {
        setSelectedAssistant(null);
      }
    } catch (error) {
      console.error('Error deleting assistant:', error);
    }
  };

  // Select assistant for editing
  const selectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
    setEditForm({
      name: assistant.name,
      picture: assistant.picture
    });
  };

  // Update assistant in Firestore
  const updateAssistant = async () => {
    if (!selectedAssistant) return;
    
    try {
      const assistantRef = doc(db, 'assistants', selectedAssistant.id);
      await updateDoc(assistantRef, {
        name: editForm.name,
        picture: editForm.picture
      });
      
      // Update local state
      setAssistants(assistants.map(assistant => 
        assistant.id === selectedAssistant.id 
          ? { ...assistant, name: editForm.name, picture: editForm.picture } 
          : assistant
      ));
      
      console.log('Assistant updated successfully');
      setSelectedAssistant(null); // Clear selection
    } catch (error) {
      console.error('Error updating assistant:', error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setSelectedAssistant(null);
  };

  return (
    <div className="App">
      <div className="main-content">
        <h1>Assistants</h1>
        <table border="1" style={{ margin: '20px', width: '80%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Picture</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assistants.map(assistant => (
              <tr 
                key={assistant.id} 
                onClick={() => selectAssistant(assistant)}
                style={{ cursor: 'pointer', backgroundColor: selectedAssistant?.id === assistant.id ? '#f0f0f0' : 'transparent' }}
              >
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
                <td>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      deleteAssistant(assistant.id);
                    }}
                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedAssistant && (
          <div style={{ 
            margin: '20px', 
            padding: '20px', 
            border: '1px solid #ccc', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h2>Edit Assistant</h2>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Picture URL:</label>
              <input
                type="text"
                name="picture"
                value={editForm.picture}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Preview:</label>
              {editForm.picture && (
                <img 
                  src={editForm.picture} 
                  alt="Preview" 
                  width="100" 
                  style={{ borderRadius: '5px' }} 
                />
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={updateAssistant}
                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '3px', cursor: 'pointer' }}
              >
                Save Changes
              </button>
              <button 
                onClick={cancelEdit}
                style={{ backgroundColor: '#ccc', border: 'none', padding: '8px 16px', borderRadius: '3px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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