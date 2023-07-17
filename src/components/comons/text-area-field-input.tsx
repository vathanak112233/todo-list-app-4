import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaFieldInputProps = {
    name: string;
    placeholder: string;
    rows?: number
}
export default function TextAreaFieldInput({
    name,
    placeholder,
    rows = 4
}: TextAreaFieldInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    type="text"
                    label={placeholder}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    className={fieldState.error ? "errorTextField" : ""}
                    fullWidth
                    multiline
                    rows={rows}
                />
            )}
        />
    );
}