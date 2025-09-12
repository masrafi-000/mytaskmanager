import { todoAPI } from "@/services/api";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

// Backend Todo interface (matches the backend model)
export interface BackendTodo {
  _id: string;
  title: string;
  desc: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  project?: string;
  tags: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend Task interface (for UI compatibility)
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

// Helper functions to convert between backend and frontend formats
const backendToFrontend = (backendTodo: BackendTodo): Task => ({
  id: backendTodo._id,
  title: backendTodo.title,
  description: backendTodo.desc,
  completed: false, // Backend doesn't have completed field, default to false
  priority: backendTodo.priority,
  due_date: backendTodo.dueDate,
  tags: backendTodo.tags || [],
  project: backendTodo.project || null,
  created_at: backendTodo.createdAt,
  updated_at: backendTodo.updatedAt,
});

const frontendToBackend = (
  task: Omit<Task, "id" | "created_at" | "updated_at">
) => ({
  title: task.title,
  desc: task.description,
  priority: task.priority,
  dueDate: task.due_date || new Date().toISOString(),
  project: task.project || "",
  tags: task.tags || [],
});

// API Error interface
interface ApiErrorShape {
  response?: { data?: { message?: string } };
  message?: string;
}

// Async thunks for API calls
const fetchTodos = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await todoAPI.getTodos();
      const backendTodos: BackendTodo[] = response.data.todos;
      return backendTodos.map(backendToFrontend);
    } catch (error) {
      const err = error as ApiErrorShape;
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch todos"
      );
    }
  }
);

const createTodo = createAsyncThunk<
  Task,
  Omit<Task, "id" | "created_at" | "updated_at">,
  { rejectValue: string }
>("todos/createTodo", async (taskData, { rejectWithValue }) => {
  try {
    const backendData = frontendToBackend(taskData);
    const response = await todoAPI.createTodo(backendData);
    return backendToFrontend(response.data.todo);
  } catch (error) {
    const err = error as ApiErrorShape;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to create todo"
    );
  }
});

const updateTodo = createAsyncThunk<
  Task,
  { id: string; taskData: Omit<Task, "id" | "created_at" | "updated_at"> },
  { rejectValue: string }
>("todos/updateTodo", async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const backendData = frontendToBackend(taskData);
    const response = await todoAPI.updateTodo(id, backendData);
    return backendToFrontend(response.data.todo);
  } catch (error) {
    const err = error as ApiErrorShape;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to update todo"
    );
  }
});

const deleteTodo = createAsyncThunk<string, string, { rejectValue: string }>(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await todoAPI.deleteTodo(id);
      return id;
    } catch (error) {
      const err = error as ApiErrorShape;
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete todo"
      );
    }
  }
);

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
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
  error: null,
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
    clearError: (state) => {
      state.error = null;
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
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch todos";
      })
      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create todo";
      })
      // Update todo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update todo";
      })
      // Delete todo
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.selectedTasks = state.selectedTasks.filter(
          (id) => id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete todo";
      });
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
  clearError,
} = todoSlice.actions;

// Export async thunks
export { createTodo, deleteTodo, fetchTodos, updateTodo };

export default todoSlice.reducer;
