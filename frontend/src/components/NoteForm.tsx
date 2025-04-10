import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  notesApi,
  CreateNoteRequest,
  UpdateNoteRequest,
} from "../services/notesApi";

interface NoteFormProps {
  isEditing?: boolean;
}

export default function NoteForm({ isEditing = false }: NoteFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      const fetchNote = async () => {
        try {
          setLoading(true);
          const note = await notesApi.getNoteById(id);
          setTitle(note.title);
          setContent(note.content);
          setCategory(note.category);
        } catch (err) {
          setError("Failed to fetch note");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      if (isEditing && id) {
        const updateData: UpdateNoteRequest = {
          title,
          content,
          category,
        };
        await notesApi.updateNote(id, updateData);
      } else {
        const createData: CreateNoteRequest = {
          title,
          content,
          category,
        };
        await notesApi.createNote(createData);
      }

      navigate("/");
    } catch (err) {
      setError(`Failed to ${isEditing ? "update" : "create"} note`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Predefined categories for selection
  const categories = ["General", "Work", "Personal", "Ideas", "To-Do"];

  if (loading && isEditing)
    return <div className="loading">Loading note...</div>;

  return (
    <div className="note-form-container">
      <h1>{isEditing ? "Edit Note" : "Create New Note"}</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content"
            required
            rows={8}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
