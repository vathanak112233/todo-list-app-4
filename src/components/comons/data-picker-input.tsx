import { FormControl } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

type DatePickerInputProps = {
    name: string;
    placeholder: string;
}

export default function DatePickerInput({
    name,
    placeholder
}: DatePickerInputProps) {
    const { control, setValue } = useFormContext();

    const handleDateChange = (date: any) => {
        if (!date) { return }
        const dueDate = dayjs(date).toISOString()
        setValue(name, dueDate, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            {...field}
                            label={placeholder}
                            value={field.value}
                            onChange={handleDateChange}
                            slotProps={{
                                textField: {
                                    helperText: fieldState.error?.message,
                                    error: !!fieldState.error
                                }
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
            )}
        />
    );
}