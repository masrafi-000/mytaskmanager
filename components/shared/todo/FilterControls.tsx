"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc, SortDesc, X } from "lucide-react";

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (priority: string) => void;
  filterProject: string;
  onFilterProjectChange: (project: string) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  sortBy: string;
  onSortByChange: (
    sortBy: "created_at" | "due_date" | "priority" | "title"
  ) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  availableProjects: string[];
  availableTags: string[];
}

export function FilterControls(props: FilterControlsProps) {
  const {
    searchQuery,
    onSearchChange,
    filterPriority,
    onFilterPriorityChange,
    filterProject,
    onFilterProjectChange,
    selectedTags,
    onSelectedTagsChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    availableProjects,
    availableTags,
  } = props;

  const removeTags = (tagToRemove: string) => {
    onSelectedTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Search  */}
      <div className=" relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks, tags, or projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={onFilterProjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {availableProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created</SelectItem>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
            }
            className="px-3"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">
            Filtered by tags:
          </span>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => removeTags(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Avaiable Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Available tags:</span>
          <div className="flex flex-wrap gap-1">
            {availableTags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-secondary"
                  onClick={() => onSelectedTagsChange([...selectedTags, tag])}
                >
                  #{tag}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
