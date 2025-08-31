"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { FilterControls } from "@/components/shared/todo/FilterControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  setFilterpriority,
  setFilterProject,
  setSearchQuery,
  setSelectedTags,
  setSortBy,
  setSortOrder,
} from "@/lib/store/todoSlice";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  AlertCircle,
  Check,
  CheckSquare,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

export default function TodoApp() {
  const dispatch = useAppDispatch();
  const {
    tasks,
    loading,
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
            weekStart.setDate(today.getDate() - today.getDate());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDate = taskDate
              ? taskDate >= weekStart && taskDate <= weekEnd
              : false;
            break;
          case "overdue":
            matchesDate = taskDate
              ? taskDate < today && !task.completed
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

    // Appyly tab filtering
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "today":
        const today = new Date().toDateString();
        filtered = filtered.filter(
          (task) =>
            task.due_date && new Date(task.due_date).toDateString() === today
        );
        break;
      case "overdue":
        const now = new Date();
        filtered = filtered.filter(
          (task) =>
            task.due_date && new Date(task.due_date) < now && !task.completed
        );
        break;
    }

    // apply sorting
    // filtered.sort((a, b) => {
    //     let aValue: any, bValue: any

    //     switch (sortBy) {
    //         case "title":
    //             aValue = a.title.toLowerCase()

    //             break;

    //         default:
    //             break;
    //     }
    // })
  }, []);

  const taskCounts = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();

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
          task.due_date && new Date(task.due_date) < now && !task.completed
      ).length,
    };
  }, [tasks]);

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

  //   const handleSelectAll = () => {
  //     const visibleTaskIds =
  //   }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Stay organized and productive with your personal task manager
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
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
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
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
            {/* FilterControl will be added soon */}
            <FilterControls
              searchQuery={searchQuery}
              onSearchChange={(query) => dispatch(setSearchQuery(query))}
              filterPriority={filterPriority}
              onFilterPriorityChange={(priority) =>
                dispatch(setFilterpriority(priority))
              }
              filterProject={filterProject}
              onFilterProjectChange={(project) =>
                dispatch(setFilterProject(project))
              }
              selectedTags={selectedTags}
              onSelectedTagsChange={(tags) => dispatch(setSelectedTags(tags))}
              sortOrder={sortOrder}
              onSortOrderChange={(order) => dispatch(setSortOrder(order))}
              sortBy={sortBy}
              onSortByChange={(sort) => dispatch(setSortBy(sort))}
              availableProjects={availableProjects}
              availableTags={availableTags}
            />
          </CardContent>
        </Card>

        {/* BulkActions */}
        {selectedTasks.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedTasks.length} selected
                  </Badge>
                  <Button variant="outline" size="sm">
                    {/* onClick={handleSelectAll} */}
                    Select All Visible
                  </Button>
                  <Button variant="outline" size="sm">
                    {/* onClick={handleClearSelection} */}
                    Clear Selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    {/* onClick={handleBulkMarkComplete} */}
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    {/* onClick={() => setBulkDeleteConfirm(true)} */}
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* task tabs */}
        <Tabs>
          <div className=" space-y-6">
            <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="text-xs">
                  {taskCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Clock className="h-4 w-4" />
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

          <TabsContent value={activeTab} className=" space-y-4">
            {/* <TaskList
              tasks={filteredTasks}
              selectedTasks={selectedTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTask}
              onDelete={setTaskToDelete}
              onToggleSelection={handleToggleSelection}
              activeTab={activeTab}
            /> */}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
      </div>
    </div>
  );
}
