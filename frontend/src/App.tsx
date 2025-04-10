import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="app-logo">
            Notes App
          </Link>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<NoteList />} />
            <Route path="/create" element={<NoteForm isEditing={false} />} />
            <Route path="/edit/:id" element={<NoteForm isEditing={true} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Notes App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
