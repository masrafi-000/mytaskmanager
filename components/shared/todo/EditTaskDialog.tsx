"use client";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/lib/store/todoSlice";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditTaskDialogProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export default function EditTaskDialog(props: EditTaskDialogProps) {
  const { task, onCancel, onSave } = props;

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTagInput, setNewTagInput] = useState("");

  useEffect(() => {
    if (task) {
      setEditingTask({ ...task });
    }
  }, [task]);

  if (!editingTask) return null;

  const addTag = () => {
    if (newTagInput.trim() && !editingTask.tags.includes(newTagInput.trim())) {
      setEditingTask({
        ...editingTask,
        tags: [...editingTask.tags, newTagInput.trim()],
      });
      setNewTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditingTask({
      ...editingTask,
      tags: editingTask.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSave = () => {
    onSave(editingTask);
  };

  return (
    <Dialog open={!!task} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              placeholder="Enter task title..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={editingTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setEditingTask({ ...editingTask, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={editingTask.due_date || ""}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    due_date: e.target.value || null,
                  })
                }
              />
            </div>
          </div>

          <div className=" flex flex-col gap-2">
            <Label htmlFor="edit-project">Project</Label>
            <Input
              id="edit-project"
              value={editingTask.project || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  project: e.target.value || null,
                })
              }
              placeholder="Enter project name..."
            />
          </div>

          <div>
            <Label htmlFor="edit-tags">Tags</Label>
            <div className="flex items-center justify-center gap-4 my-2">
              <Input
                id="edit-tags"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="dark:hover:text-white dark:hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {editingTask.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className=" flex justify-end gap-4">
            <Button className="dark:hover:text-white dark:hover:bg-red-500" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
