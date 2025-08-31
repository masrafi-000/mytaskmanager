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
  },
});

export const { addTask } = todoSlice.actions;

export default todoSlice.reducer;
