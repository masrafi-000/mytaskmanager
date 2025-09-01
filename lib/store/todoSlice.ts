import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  tags: string[];
  project: string | null;
  created_at: string;
  updated_at: string;
}

interface TodoState {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  filterPriority: string;
  filterProject: string;
  selectedTags: string[];
  activeTab: string;
  sortBy: "created_at" | "due_date" | "priority" | "title";
  sortOrder: "asc" | "desc";
  dateFilter: string;
  selectedTasks: string[];
}

const initialState: TodoState = {
  tasks: [],
  loading: false,
  searchQuery: "",
  filterPriority: "all",
  filterProject: "all",
  selectedTags: [],
  activeTab: "all",
  sortBy: "created_at",
  sortOrder: "desc",
  dateFilter: "all",
  selectedTasks: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<Omit<Task, "id" | "created_at" | "updated_at">>
    ) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.tasks.unshift(newTask);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.selectedTasks = state.selectedTasks.filter(
        (id) => id !== action.payload
      );
    },
    deleteTasks: (state, action: PayloadAction<string[]>) => {
      state.tasks = state.tasks.filter(
        (task) => !action.payload.includes(task.id)
      );
      state.selectedTasks = [];
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updated_at = new Date().toISOString();
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setFilterProject: (state, action: PayloadAction<string>) => {
      state.filterProject = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"created_at" | "due_date" | "priority" | "title">
    ) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<string>) => {
      state.dateFilter = action.payload;
    },
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.selectedTasks.includes(taskId)) {
        state.selectedTasks = state.selectedTasks.filter((id) => id !== taskId);
      } else {
        state.selectedTasks.push(taskId);
      }
    },
    selectAllTasks: (state, action: PayloadAction<string[]>) => {
      state.selectedTasks = action.payload;
    },
    clearSelection: (state) => {
      state.selectedTasks = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteTasks,
  toggleComplete,
  setSearchQuery,
  setFilterPriority,
  setFilterProject,
  setSelectedTags,
  setActiveTab,
  setSortBy,
  setSortOrder,
  setDateFilter,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  setLoading,
} = todoSlice.actions;

export default todoSlice.reducer;
