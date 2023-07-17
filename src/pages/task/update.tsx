import TaskForm from "@/components/task-form";
import { Task } from "@/models/task";
import { ApiEndpoint } from "@/utitls/api-endpoint";
import { GET } from "@/utitls/fetch-api";
import { ApiResponse } from "@/utitls/responde-DTO";
import { GetServerSideProps } from "next";
import { useQuery } from "react-query";
import dayjs from "dayjs";

export default function TaskUpdate({ taskId }: { taskId: number }) {
    const { data } = useQuery({
        queryKey: 'get-task-by-id',
        queryFn: () => GET(ApiEndpoint.TASK, taskId).then((res: ApiResponse<Task>) => res.data as Task),
    });

    return (data && <TaskForm
        initialData={{ ...data, dueDate: dayjs(data.dueDate) }}
        taskId={taskId} />)
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const taskId: number = Number(query.id);
    return { props: { taskId } }
}