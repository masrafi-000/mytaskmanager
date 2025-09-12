"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import AddTaskDialog from "@/components/shared/todo/AddTaskDialog";
import EditTaskDialog from "@/components/shared/todo/EditTaskDialog";
import { FilterControls } from "@/components/shared/todo/FilterControls";
import TaskList from "@/components/shared/todo/TaskList";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logout } from "@/lib/store/authSlice";
import {
  clearError,
  clearSelection,
  createTodo,
  deleteTasks,
  deleteTodo,
  fetchTodos,
  selectAllTasks,
  setActiveTab,
  setFilterPriority,
  setFilterProject,
  setSearchQuery,
  setSelectedTags,
  setSortBy,
  setSortOrder,
  Task,
  toggleComplete,
  toggleTaskSelection,
  updateTask,
  updateTodo,
} from "@/lib/store/todoSlice";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  AlertCircle,
  Check,
  CheckSquare,
  Clock,
  FileCheck2,
  Hourglass,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function TodoApp() {
  const dispatch = useAppDispatch();
  const {
    tasks,
    loading,
    error,
    searchQuery,
    filterPriority,
    filterProject,
    selectedTags,
    activeTab,
    sortBy,
    sortOrder,
    dateFilter,
    selectedTasks,
  } = useAppSelector((state) => state.todos);

  const { user } = useAppSelector((state) => state.auth);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setIsAddDialogOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        ) as HTMLInputElement;
        searchInput?.focus();
      }

      if (e.key === "Escape") {
        setIsAddDialogOpen(false);
        setEditingTask(null);
        clearSelection();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check if user is already logged in from localStorage and fetch todos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // User has token but not in Redux state, redirect to login
      // This will be handled by the auth system
    }
  }, [user]);

  // Fetch todos when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchTodos());
    }
  }, [user, dispatch]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (task.project &&
          task.project.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesProject =
        filterProject === "all" || task.project === filterProject;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => task.tags.includes(tag));

      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const taskDate = task.due_date ? new Date(task.due_date) : null;

        switch (dateFilter) {
          case "today":
            matchesDate = taskDate
              ? taskDate.toDateString() === today.toDateString()
              : false;
            break;
          case "tomorrow":
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            matchesDate = taskDate
              ? taskDate.toDateString() === tomorrow.toDateString()
              : false;
            break;
          case "this-week":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDate = taskDate
              ? taskDate >= weekStart && taskDate <= weekEnd
              : false;
            break;
          case "overdue":
            matchesDate = taskDate
              ? taskDate.toDateString() < today.toDateString() &&
                !task.completed
              : false;
            break;
          case "no-date":
            matchesDate = !taskDate;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesPriority &&
        matchesProject &&
        matchesTags &&
        matchesDate
      );
    });

    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "today":
        const todayTab = new Date().toDateString();
        filtered = filtered.filter(
          (task) =>
            task.due_date && new Date(task.due_date).toDateString() === todayTab
        );
        break;
      case "overdue":
        const todayOverdue = new Date().toDateString();
        filtered = filtered.filter(
          (task) =>
            task.due_date &&
            new Date(task.due_date).toDateString() < todayOverdue &&
            !task.completed
        );
        break;
    }

    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "due_date":
          aValue = a.due_date
            ? new Date(a.due_date).getTime()
            : Number.POSITIVE_INFINITY;
          bValue = b.due_date
            ? new Date(b.due_date).getTime()
            : Number.POSITIVE_INFINITY;
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    tasks,
    searchQuery,
    filterPriority,
    filterProject,
    selectedTags,
    activeTab,
    sortBy,
    sortOrder,
    dateFilter,
  ]);

  const availableProjects = useMemo(() => {
    const projects = tasks
      .map((task) => task.project)
      .filter((project): project is string => !!project);
    return Array.from(new Set(projects));
  }, [tasks]);

  const availableTags = useMemo(() => {
    const allTags = tasks.flatMap((task) => task.tags);
    return Array.from(new Set(allTags));
  }, [tasks]);

  const taskCounts = useMemo(() => {
    const today = new Date().toDateString();

    return {
      all: tasks.length,
      pending: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
      today: tasks.filter(
        (task) =>
          task.due_date && new Date(task.due_date).toDateString() === today
      ).length,
      overdue: tasks.filter(
        (task) =>
          task.due_date &&
          new Date(task.due_date).toDateString() < today &&
          !task.completed
      ).length,
    };
  }, [tasks]);

  const handleAddTask = async (newTaskData: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    tags: string[];
    project: string;
  }) => {
    setIsSubmitting(true);

    try {
      await dispatch(
        createTodo({
          title: newTaskData.title.trim(),
          description: newTaskData.description.trim(),
          priority: newTaskData.priority,
          due_date: newTaskData.dueDate || null,
          tags: newTaskData.tags,
          project: newTaskData.project.trim() || null,
          completed: false,
        })
      ).unwrap();

      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
      // Error is handled by Redux state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await dispatch(
        updateTodo({
          id: updatedTask.id,
          taskData: {
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            due_date: updatedTask.due_date,
            tags: updatedTask.tags,
            project: updatedTask.project,
            completed: updatedTask.completed,
          },
        })
      ).unwrap();

      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update todo:", error);
      // Error is handled by Redux state
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete todo:", error);
      // Error is handled by Redux state
    }
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleComplete(id));
  };

  const handleToggleSelection = (taskId: string) => {
    dispatch(toggleTaskSelection(taskId));
  };

  const handleSelectAll = () => {
    const visibleTaskIds = filteredTasks.map((task) => task.id);
    dispatch(selectAllTasks(visibleTaskIds));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleBulkMarkComplete = () => {
    selectedTasks.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        dispatch(updateTask({ id: taskId, updates: { completed: true } }));
      }
    });
    dispatch(clearSelection());
  };

  const handleBulkDelete = () => {
    dispatch(deleteTasks(selectedTasks));
    setBulkDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearError())}
                className="ml-auto text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Stay organized and productive with your personal task manager
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user ? (
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Guest</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
                <kbd className="hidden sm:inline-flex px-1.5 font-mono h-5 select-none items-center gap-1 rounded border bg-muted text-[10px] font-medium text-muted-foreground ">
                  <span>⌘</span>N
                </kbd>
              </Button>
            </div>
            <div>
              {user ? (
                <Button
                  onClick={() => dispatch(logout())}
                  variant="outline"
                  size="sm"
                  className="bg-transparent cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className=" hidden sm:inline-block">Logout</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent cursor-pointer"
                >
                  <Link
                    className="w-full flex items-center gap-2"
                    href="/auth/login"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Login</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {taskCounts.all}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {taskCounts.pending}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Pending
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {taskCounts.completed}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Done
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {taskCounts.today}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Today
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 sm:p-4">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {taskCounts.overdue}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Overdue
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterControls
              searchQuery={searchQuery}
              onSearchChange={(query) => dispatch(setSearchQuery(query))}
              filterPriority={filterPriority}
              onFilterPriorityChange={(priority) =>
                dispatch(setFilterPriority(priority))
              }
              filterProject={filterProject}
              onFilterProjectChange={(project) =>
                dispatch(setFilterProject(project))
              }
              selectedTags={selectedTags}
              onSelectedTagsChange={(tags) => dispatch(setSelectedTags(tags))}
              sortBy={sortBy}
              onSortByChange={(sort) => dispatch(setSortBy(sort))}
              sortOrder={sortOrder}
              onSortOrderChange={(order) => dispatch(setSortOrder(order))}
              availableProjects={availableProjects}
              availableTags={availableTags}
            />
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedTasks.length} selected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="cursor-pointer dark:hover:text-white hover:bg-green-600"
                  >
                    Select All Visible
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    className=" cursor-pointer hover:bg-red-600 dark:hover:text-white"
                  >
                    Clear Selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkComplete}
                    className="gap-2 bg-transparent dark:hover:text-white hover:bg-amber-600 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Mark Complete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkDeleteConfirm(true)}
                    className="gap-2 text-destructive  cursor-pointer hover:bg-red-700 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => dispatch(setActiveTab(value))}
          className="space-y-6"
        >
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <FileCheck2 className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Hourglass className="h-4 w-4" />
                <span className="hidden sm:inline">Pending</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.pending}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="today"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Today</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.today}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="overdue"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Overdue</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.overdue}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Done</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.completed}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading tasks...
                  </p>
                </CardContent>
              </Card>
            ) : (
              <TaskList
                tasks={filteredTasks}
                selectedTasks={selectedTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={setTaskToDelete}
                onToggleSelection={handleToggleSelection}
                activeTab={activeTab}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddTaskDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddTask={handleAddTask}
          isSubmitting={isSubmitting}
        />

        <EditTaskDialog
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!taskToDelete}
          onOpenChange={() => setTaskToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation */}
        <AlertDialog
          open={bulkDeleteConfirm}
          onOpenChange={setBulkDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Selected Tasks</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedTasks.length} selected
                task
                {selectedTasks.length > 1 ? "s" : ""}? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
