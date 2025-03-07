import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import firebaseApp from '../firebase';

// Initialize Firestore
const db = getFirestore(firebaseApp);
const COLLECTION_NAME = 'assistants';

/**
 * Service for handling assistant-related operations with Firestore
 */
export const assistantService = {
  /**
   * Fetch all assistants from Firestore
   * @returns {Promise<Array>} Array of assistant objects
   */
  async getAllAssistants() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching assistants:', error);
      throw error;
    }
  },

  /**
   * Add a new assistant to Firestore
   * @param {Object} assistant - The assistant object to add
   * @returns {Promise<Object>} The added assistant with ID
   */
  async addAssistant(assistant) {
    try {
      const currentDate = new Date();
      const assistantWithDate = {
        ...assistant,
        creationDate: currentDate
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), assistantWithDate);
      return { 
        id: docRef.id, 
        ...assistantWithDate 
      };
    } catch (error) {
      console.error('Error adding assistant:', error);
      throw error;
    }
  },

  /**
   * Update an existing assistant in Firestore
   * @param {string} id - The ID of the assistant to update
   * @param {Object} updates - The fields to update
   * @returns {Promise<void>}
   */
  async updateAssistant(id, updates) {
    try {
      const assistantRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(assistantRef, updates);
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating assistant:', error);
      throw error;
    }
  },

  /**
   * Delete an assistant from Firestore
   * @param {string} id - The ID of the assistant to delete
   * @returns {Promise<void>}
   */
  async deleteAssistant(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return id;
    } catch (error) {
      console.error('Error deleting assistant:', error);
      throw error;
    }
  }
}; 