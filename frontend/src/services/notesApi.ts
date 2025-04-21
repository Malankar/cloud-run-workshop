import axios from "axios";

// Define the API base URL
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Type definitions for notes
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  category?: string;
}

// API methods
export const notesApi = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    console.log("API_URL:: ", API_URL);
    const response = await axios.get(`${API_URL}/notes`);
    return response.data;
  },

  // Get a single note by ID
  getNoteById: async (id: string): Promise<Note> => {
    const response = await axios.get(`${API_URL}/notes/${id}`);
    return response.data;
  },

  // Create a new note
  createNote: async (note: CreateNoteRequest): Promise<Note> => {
    const response = await axios.post(`${API_URL}/notes`, note);
    return response.data;
  },

  // Update an existing note
  updateNote: async (id: string, note: UpdateNoteRequest): Promise<Note> => {
    const response = await axios.put(`${API_URL}/notes/${id}`, note);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id: string): Promise<Note> => {
    const response = await axios.delete(`${API_URL}/notes/${id}`);
    return response.data;
  },
};
