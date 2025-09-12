"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/lib/store/todoSlice";
import { cn } from "@/lib/utils";
import { Calendar, Edit, Flag, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

export default function TaskCard(props: TaskCardProps) {
  const {
    task,
    isSelected,
    onToggleComplete,
    onDelete,
    onEdit,
    onToggleSelection,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-md border-l-4",
        task.completed ? "opacity-60 bg-muted/30" : "",
        isSelected ? " ring-2 ring-primary" : "",
        task.priority === "high"
          ? "border-l-red-500"
          : task.priority === "medium"
          ? "border-l-yellow-500"
          : "border-l-green-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(task.id)}
            className=" mt-1 border  border-red-500 "
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium text-sm sm:text-base leading-tight cursor-pointer transition-colors",
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground hover:text-primary"
                  )}
                  onClick={() => onToggleComplete(task.id)}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "flex gap-1 transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="secondary"
                className={getPriorityColor(task.priority)}
              >
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>

              {task.project && (
                <Badge variant="outline" className="text-xs">
                  {task.project}
                </Badge>
              )}

              {task.due_date && (
                <Badge
                  variant={isOverdue ? "destructive" : "outline"}
                  className="text-xs"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(task.due_date).toLocaleDateString()}
                </Badge>
              )}

              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
