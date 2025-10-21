import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import { NoteCard } from "@/components/NoteCard";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notesApi, apiUtils } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const { toast } = useToast();

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Load notes with search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadNotes();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesApi.getNotes({
        q: searchQuery || undefined,
        limit: 100, // Load more notes
      });
      
      setNotes(response.data);
    } catch (err) {
      const errorMessage = apiUtils.getErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsEditing(true);
  };

  const handleSaveNote = async (note: Note) => {
    try {
      setLoading(true);
      
      if (note.id && note.id.trim() !== "") {
        // Update existing note
        const response = await notesApi.updateNote(note.id, {
          title: note.title,
          content: note.content,
        });
        setNotes(notes.map(n => n.id === note.id ? response.data : n));
        toast({
          title: "Note updated",
          description: "Your note has been saved successfully.",
        });
      } else {
        // Create new note
        const response = await notesApi.createNote({
          title: note.title,
          content: note.content,
        });
        setNotes([response.data, ...notes]);
        toast({
          title: "Note created",
          description: "Your new note has been created.",
        });
      }
      
      setIsEditing(false);
      setSelectedNote(null);
    } catch (err) {
      const errorMessage = apiUtils.getErrorMessage(err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
        variant: "destructive",
      });
    } catch (err) {
      const errorMessage = apiUtils.getErrorMessage(err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  // Show error state
  if (error && !isApiAvailable) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-muted-foreground">Create and manage your markdown notes</p>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to the server. Please make sure the backend is running.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-muted-foreground">Create and manage your markdown notes</p>
        </div>

        {isEditing ? (
          <div className="h-[calc(100vh-200px)]">
            <MarkdownEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={() => {
                setIsEditing(false);
                setSelectedNote(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleCreateNew} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading notes...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            ) : notes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No notes found matching your search."
                    : "No notes yet. Create your first note!"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreateNew} size="lg" disabled={loading}>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Note
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
