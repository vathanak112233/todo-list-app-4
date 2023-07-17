import TaskForm from "@/components/task-form";
import { defaultTaskForm } from "@/schema/create";

export default function TaskCreate() {
    return (
        <TaskForm  initialData={defaultTaskForm}/>
    )
}