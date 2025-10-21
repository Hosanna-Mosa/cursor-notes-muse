import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, Eye, Edit3, Loader2 } from "lucide-react";
import { Note } from "@/types/note";

interface MarkdownEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export const MarkdownEditor = ({ note, onSave, onCancel }: MarkdownEditorProps) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  // Update form when note changes
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const savedNote: Note = {
        id: note?.id || "", // Don't generate ID for new notes
        title: title.trim() || "Untitled",
        content: content.trim() || " ",
        createdAt: note?.createdAt || now,
        updatedAt: now,
      };
      await onSave(savedNote);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold border-0 focus-visible:ring-0 px-0"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm" disabled={saving}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
          <TabsTrigger value="edit" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1 m-0 p-4">
          <Textarea
            placeholder="Start writing your note... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none border-0 focus-visible:ring-0 text-base"
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 p-4 overflow-auto">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
