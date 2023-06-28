import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";

type FormValue = {
    title: string;
    description: string;
    dueDate: any;
    priority: string;
    status: string;
}
export default function TaskForm() {
    const schema = z.object({
        title: z.string().refine((value) => value.trim() !== "", {
            message: "Field title is require"
        }),
        description: z.string().refine((value) => value.trim() !== "", {
            message: "Field description is require"
        }),
        dueDate: z.string().refine((value) => value.trim() !== "", {
            message: "Field due date is require"
        }),
        priority: z.string().refine((value) => value.trim() !== "", {
            message: "Field priority is require"
        }),
        status: z.string().refine((value) => value.trim() !== "", {
            message: "Field status is require"
        })
    })

    const [accessToken, setAccessToken] = useState("");
    const [userId, setUerId] = useState<number>(0);

    const router = useRouter();
    const taskId: number = Number(router.query.id);

    const form = useForm<FormValue>({
        defaultValues: {
            title: "",
            description: "",
            status: "",
            priority: "",
            dueDate: ""
        },
        resolver: zodResolver(schema)
    });

    const { control, formState, setValue, handleSubmit } = form;
    const { isValid, isSubmitSuccessful } = formState;

    const onSubmit = (data: FormValue) => {
        if (!isValid) { return }
        if (taskId) {
            updateTask(taskId, data);
            return;
        }
        saveTask(data, userId);
    };

    const saveTask = async (payload: FormValue, userId: number) => {
        try {
            const response = await fetch("/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `${accessToken}`,
                },
                body: JSON.stringify({ ...payload, userId: userId }),
            });
            if (response.status === 200) {
                alert("Task added successfully");
            }
        } catch (error) {
            alert(error);
        }
    };

    const updateTask = async (id: number, payload: FormValue) => {
        try {
            const response = await fetch(`/api/task/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `${accessToken}`,
                },
                body: JSON.stringify({ ...payload, userId: userId }),
            });
            if (response.status === 200) {
                alert("Task updated successfully");
            }
        } catch (error) {
            alert(error);
        }
    };


    const fetchSession = async () => {
        const session: any = await getSession();
        if (session) {
            setAccessToken(session.user.accessToken);
            setUerId(session.user.id);
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    useEffect(() => {
        if (!taskId || !accessToken) {
            return
        }
        const getTaskById = async (id: number) => {
            try {
                const response = await fetch(`/api/task/${id}`, {
                    headers: {
                        authorization: `${accessToken}`,
                    },
                });
                const formValue = await response.json();
                setValue("title", formValue?.title);
                setValue("dueDate", dayjs(formValue?.dueDate));
                setValue("priority", formValue?.priority);
                setValue("status", formValue?.status);
                setValue("description", formValue?.description);
            } catch (error) {
                alert(error);
            }
        }
        getTaskById(taskId);
    }, [accessToken, taskId, setValue])

    useEffect(() => {
        if (isSubmitSuccessful) {
            router.push('/task')
        }
    }, [isSubmitSuccessful, router])

    const handleDateChange = (date: any) => {
        if (!date) { return }
        const dueDate = dayjs(date).toISOString()
        setValue("dueDate", dueDate, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    className={fieldState.error ? "errorTextField" : ""}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth error={!!fieldState.error}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            {...field}
                                            label="Due Date"
                                            value={field.value}
                                            // onChange={(value: any) => setValue("dueDate", value ? value.toISOString() : "", {
                                            //     shouldDirty: true,
                                            //     shouldTouch: true,
                                            //     shouldValidate: true
                                            // })}
                                            onChange={handleDateChange}
                                            slotProps={{
                                                textField: {
                                                    helperText: fieldState.error?.message,
                                                    error: !!fieldState.error
                                                }
                                            }}
                                        />

                                    </LocalizationProvider>
                                    {/* <Typography className="dateErrorTextField" variant="body2" color="error">
                                        {fieldState.error?.message}
                                    </Typography> */}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        {...field}
                                        label="Priority"
                                        type="text"
                                        error={!!fieldState.error}
                                    >
                                        <MenuItem value="urgent">Urgent</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="normal">Normal</MenuItem>
                                    </Select>
                                    <FormHelperText className={fieldState.error ? "errorHelperText" : ""} error>
                                        {fieldState.error?.message}
                                    </FormHelperText>
                                </FormControl>

                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        {...field}
                                        label="Status"
                                        type="text"
                                        error={!!fieldState.error}
                                    >
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Done">Done</MenuItem>
                                    </Select>
                                    <FormHelperText className={fieldState.error ? "errorHelperText" : ""} error>
                                        {fieldState.error?.message}
                                    </FormHelperText>
                                </FormControl>

                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type="text"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    className={fieldState.error ? "errorTextField" : ""}
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            )}
                        />
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
        </>
    )
}