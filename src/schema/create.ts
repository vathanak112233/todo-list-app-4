import { Task } from "@/models/task";
import { FieldValidation } from "@/utitls/validate-factory";

export const StatusOptions = [
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Pending", value: "Pending" },
    { label: "Done", value: "Done" }
]

export const defaultTaskForm: Task = {
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
}

export const taskValidateField: FieldValidation<Task>[] = [
    { field: "title", message: "Field title is required" },
    { field: "description", message: "Field description is required" },
    { field: "dueDate", message: "Field due date is required" },
    { field: "priority", message: "Field priority is required" },
    { field: "status", message: "Field status is required" },
];
