import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DELETE, GET } from "@/utitls/fetch-api";
import { ApiEndpoint } from "@/utitls/api-endpoint";
import MyTable, { ColumnTable } from "@/components/comons/my-table"
import { Task } from "@/models/task"
import { useRouter } from "next/router";
import { ApiResponse } from "@/utitls/responde-DTO";

export default function Task() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data } = useQuery({
        queryKey: 'get-task',
        queryFn: () => GET(ApiEndpoint.TASK).then((response: ApiResponse<Task>) => response.data as Task[])
    })
    const rows: Task[] = data || [];

    const mutation = useMutation((id: number) =>
        DELETE(ApiEndpoint.TASK, id).then((response: Task) => response as Task), {
        onSuccess: (taskDeleted: Task) => {
            queryClient.setQueryData<Task[]>('get-task', (response) => {
                return response?.filter(res => res.id !== taskDeleted.id) || [];
            });
        }
    })
    const deleteTask = (id: number) => mutation.mutate(id);

    const columnsTask: ColumnTable<Task>[] = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "dueDate", label: "Due Date" },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status" },
        { key: "user.username", label: "Create By" },
        {
            key: "action",
            label: "Action",
            actions: [
                {
                    label: "edit",
                    icon: <EditIcon fontSize="small" />,
                    onClick: (task: Task) => router.push(`task/update?id=${task.id}`)
                },
                {
                    label: "delete",
                    icon: <DeleteIcon fontSize="small" />,
                    color: "error",
                    onClick: (task: any) => deleteTask(task.id)
                }
            ]
        }
    ]

    return (<>
        <div className="header-action">
            <div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    href="/task/create"
                >
                    Add Task
                </Button>
            </div>
        </div>

        <MyTable
            data={rows}
            columns={columnsTask} />
    </>)
}