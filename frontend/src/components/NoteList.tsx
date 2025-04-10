import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { notesApi, Note } from "../services/notesApi";

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get unique categories from notes
  const categories = Array.from(new Set(notes.map((note) => note.category)));

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await notesApi.getAllNotes();
        setNotes(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch notes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await notesApi.deleteNote(id);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (err) {
        setError("Failed to delete note");
        console.error(err);
      }
    }
  };

  // Filter notes by category if selected
  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category === selectedCategory)
    : notes;

  if (loading) return <div className="loading">Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>My Notes</h1>
        <Link to="/create" className="btn-create">
          <FaPlus /> New Note
        </Link>
      </div>

      <div className="categories">
        <span
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => setSelectedCategory("")}
        >
          All
        </span>
        {categories.map((category) => (
          <span
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </span>
        ))}
      </div>

      {filteredNotes.length === 0 ? (
        <p className="no-notes">
          No notes found. Create a new note to get started.
        </p>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <div className="note-category">{note.category}</div>
              <p className="note-content">
                {note.content.length > 100
                  ? `${note.content.substring(0, 100)}...`
                  : note.content}
              </p>
              <div className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
              <div className="note-actions">
                <Link to={`/edit/${note.id}`} className="btn-edit">
                  <FaEdit />
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
