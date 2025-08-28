"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, MoreHorizontal, Edit, Trash2, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";

import { Notice } from "@/types/notice";
import { 
  fetchNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice, 
  toggleNoticePin 
} from "@/lib/api/notices";
import { NoticeEditor } from "@/components/admin/notice-editor";
import { NoticeMarkdownRenderer } from "@/components/notices/markdown-renderer";
import { Container } from "@/components/ui/container";

interface NoticeFormData {
  title: string;
  description: string;
  content: string;
  category: "events" | "announcements" | "maintenance";
  image?: string;
  isPinned: boolean;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    description: "",
    content: "",
    category: "announcements",
    image: "",
    isPinned: false,
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const response = await fetchNotices();
      setNotices(response.notices);
    } catch (error) {
      toast.error("Failed to load notices");
      console.error("Error loading notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "announcements",
      image: "",
      isPinned: false,
    });
    setEditingNotice(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      content: notice.content,
      category: notice.category,
      image: notice.image || "",
      isPinned: notice.isPinned || false,
    });
    setDialogOpen(true);
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) {
      errors.push("Title is required");
    } else if (formData.title.length > 200) {
      errors.push("Title must be less than 200 characters");
    }
    
    if (!formData.description.trim()) {
      errors.push("Description is required");
    } else if (formData.description.length > 1000) {
      errors.push("Description must be less than 1000 characters");
    }
    
    if (!formData.content.trim()) {
      errors.push("Content is required");
    }
    
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image.trim());
      } catch {
        errors.push("Image URL is invalid");
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        category: formData.category,
        image: formData.image?.trim() || undefined,
        isPinned: formData.isPinned,
      };

      if (editingNotice) {
        await updateNotice(editingNotice.id, submitData);
        toast.success("Notice updated successfully");
      } else {
        await createNotice(submitData);
        toast.success("Notice created successfully");
      }

      setDialogOpen(false);
      resetForm();
      await loadNotices();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(editingNotice ? `Failed to update notice: ${errorMessage}` : `Failed to create notice: ${errorMessage}`);
      console.error("Error submitting notice:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingNotice) return;

    try {
      await deleteNotice(deletingNotice.id);
      toast.success("Notice deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingNotice(null);
      await loadNotices();
    } catch (error) {
      toast.error("Failed to delete notice");
      console.error("Error deleting notice:", error);
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      await toggleNoticePin(notice);
      toast.success(notice.isPinned ? "Notice unpinned" : "Notice pinned");
      await loadNotices();
    } catch (error) {
      toast.error("Failed to update pin status");
      console.error("Error toggling pin:", error);
    }
  };

  const getCategoryColor = (category: Notice["category"]) => {
    switch (category) {
      case "events": return "bg-blue-100 text-blue-800";
      case "announcements": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading notices...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Notices</h1>
          <p className="text-muted-foreground">Create, edit, and delete notices</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No notices found. Create your first notice to get started.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {notice.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                      <div>
                        <div className="font-medium">{notice.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {notice.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(notice.category)}>
                      {notice.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notice.isPinned ? (
                      <Badge variant="outline" className="text-yellow-600">
                        Pinned
                      </Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(notice)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePin(notice)}>
                          {notice.isPinned ? (
                            <>
                              <PinOff className="h-4 w-4 mr-2" />
                              Unpin
                            </>
                          ) : (
                            <>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setDeletingNotice(notice);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNotice ? "Edit Notice" : "Create New Notice"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notice title"
                  maxLength={200}
                  required
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.title.length}/200 characters
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value: "events" | "announcements" | "maintenance") => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcements">Announcements</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter a brief description"
                maxLength={1000}
                rows={3}
                required
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.description.length}/1000 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown) *</Label>
              <NoticeEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Enter the notice content using markdown..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPinned"
                checked={formData.isPinned}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isPinned: checked === true }))
                }
              />
              <Label htmlFor="isPinned">Pin this notice</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : (editingNotice ? "Update Notice" : "Create Notice")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingNotice?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
