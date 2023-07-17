import { ColumnTable } from "@/components/comons/my-table"
import { Task } from "@/models/task"

const handleClick = (data: any) => {
    console.log(data);
}

export const columnsTask: ColumnTable<Task>[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "dueDate", label: "Due Date" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "user.username", label: "Create By" },
    // {
    //     key: "edit",
    //     label: "Action",
    //     actions: (task: Task) => handleClick(task)
    // }
]