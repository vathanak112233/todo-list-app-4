import { Button, Grid } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import SelectInput from "./comons/select-input";
import { StatusOptions, taskValidateField } from "@/schema/create";
import DatePickerInput from "./comons/data-picker-input";
import TextFieldInput from "./comons/text-field-input";
import TextAreaFieldInput from "./comons/text-area-field-input";
import { createSchema, resolver } from "@/utitls/validate-factory";
import { z } from "zod"
import { useMutation } from "react-query";
import { POST, PUT } from "@/utitls/fetch-api";
import { ApiEndpoint } from "@/utitls/api-endpoint";
import { Task } from "@/models/task";
import { useRouter } from "next/router";

// const schema = z.object({
//     a: z.string()
// })
// type TaskFormValue = z.infer<typeof schema>

type TaskFormProps = {
    initialData?: Task,
    taskId?: number
}

export default function TaskForm({ initialData, taskId }: TaskFormProps) {
    const router = useRouter();

    const schema = createSchema<Task>(taskValidateField);
    const methods = useForm<Task>({
        defaultValues: initialData,
        resolver: (value) => resolver(schema, value)
    });

    const { handleSubmit } = methods;

    const mutation = useMutation((body: any) => {
        if (initialData && taskId) {
            return PUT(ApiEndpoint.TASK, taskId, body)
        } else {
            return POST(ApiEndpoint.TASK, body)
        }
    }, {
        onSuccess: () => router.push('/task')
    })

    const onSubmit = (data: any) => {
        mutation.mutate(data)
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextFieldInput
                            name="title"
                            placeholder="Title" />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePickerInput
                            name="dueDate"
                            placeholder="Due Date" />
                    </Grid>
                    <Grid item xs={6}>
                        <SelectInput
                            name="priority"
                            placeholder="Priority"
                            fieldLabel="label"
                            fieldValue="value"
                            apiEndPoint="/api/priority/list"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <SelectInput
                            name="status"
                            placeholder="Status"
                            fieldLabel="label"
                            fieldValue="value"
                            options={StatusOptions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextAreaFieldInput
                            name="description"
                            placeholder="Description" />
                    </Grid>

                    <Grid item xs={12}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-center"
                        gap={2}>
                        <Button variant="contained" color="error" href="/task" type="button">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit">
                            {taskId ? "Update" : "Save"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {/* <DevTool control={control}></DevTool> */}
        </FormProvider>
    )
}