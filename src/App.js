import './App.css';
import React, { useEffect, useState } from 'react';
import { assistantService } from './services/assistantService';
import { Icon } from './components/Icons';
import { Button, DeleteButton } from './components/Button';

function App() {
  const [assistants, setAssistants] = useState([]);
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    picture: '',
  });
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assistants data
  useEffect(() => {
    const fetchAssistants = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await assistantService.getAllAssistants();
        setAssistants(data);
      } catch (error) {
        setError('Failed to fetch assistants');
        console.error(error);
      } finally {
        setLoading(false);
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

  // Add new assistant
  const addAssistant = async () => {
    if (newAssistant.name && newAssistant.picture) {
      setLoading(true);
      setError(null);
      try {
        const addedAssistant = await assistantService.addAssistant({
          name: newAssistant.name,
          picture: newAssistant.picture,
        });
        
        setAssistants(prev => [...prev, addedAssistant]);
        setNewAssistant({ name: '', picture: '' });  // Clear form
      } catch (error) {
        setError('Failed to add assistant');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  // Delete assistant
  const deleteAssistant = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await assistantService.deleteAssistant(id);
      setAssistants(assistants.filter(assistant => assistant.id !== id));
      
      // If the deleted assistant was selected, clear the selection
      if (selectedAssistant && selectedAssistant.id === id) {
        setSelectedAssistant(null);
      }
    } catch (error) {
      setError('Failed to delete assistant');
      console.error(error);
    } finally {
      setLoading(false);
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

  // Update assistant
  const updateAssistant = async () => {
    if (!selectedAssistant) return;
    
    setLoading(true);
    setError(null);
    try {
      const updates = {
        name: editForm.name,
        picture: editForm.picture
      };
      
      await assistantService.updateAssistant(selectedAssistant.id, updates);
      
      // Update local state
      setAssistants(assistants.map(assistant => 
        assistant.id === selectedAssistant.id 
          ? { ...assistant, ...updates } 
          : assistant
      ));
      
      setSelectedAssistant(null); // Clear selection
    } catch (error) {
      setError('Failed to update assistant');
      console.error(error);
    } finally {
      setLoading(false);
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
        
        {error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
        {loading && <div className="loading-indicator">Loading...</div>}
        
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
                  <DeleteButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      deleteAssistant(assistant.id);
                    }}
                    disabled={loading}
                    className="table-action-button"
                  />
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
                disabled={loading}
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
                disabled={loading}
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
              <Button 
                variant="primary"
                iconName="Save"
                onClick={updateAssistant}
                disabled={loading}
              >
                Save Changes
              </Button>
              <Button 
                variant="secondary"
                iconName="X"
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <h2>Add New Assistant</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newAssistant.name}
            onChange={handleChange}
            disabled={loading}
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            name="picture"
            placeholder="Picture URL"
            value={newAssistant.picture}
            onChange={handleChange}
            disabled={loading}
            style={{ padding: '8px' }}
          />
          <Button 
            variant="primary"
            iconName="UserPlus"
            onClick={addAssistant} 
            disabled={loading}
          >
            Add Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;