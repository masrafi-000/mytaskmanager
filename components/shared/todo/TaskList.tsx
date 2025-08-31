import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/lib/store/todoSlice";
import { AlertCircle, CheckSquare, Clock } from "lucide-react";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSelection: (id: string) => void;
  activeTab: string;
}

export default function TaskList(props: TaskListProps) {
  const {
    tasks,
    selectedTasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onToggleSelection,
    activeTab,
  } = props;

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {activeTab === "completed" ? (
            <>
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No completed tasks
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete some tasks to see them here.
              </p>
            </>
          ) : activeTab === "overdue" ? (
            <>
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No overdue tasks
              </h3>
              <p className="text-sm text-muted-foreground">
                Great job staying on top of your deadlines!
              </p>
            </>
          ) : activeTab === "today" ? (
            <>
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No tasks due today
              </h3>
              <p className="text-sm text-muted-foreground">
                Enjoy your free day or add some tasks!
              </p>
            </>
          ) : (
            <>
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No tasks yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first task to get started!
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </div>
  );
}
