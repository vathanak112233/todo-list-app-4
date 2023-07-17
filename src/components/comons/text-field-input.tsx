import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TextFieldInputProp = {
    name: string;
    placeholder: string;
}
export default function TextFieldInput({
    name,
    placeholder
}: TextFieldInputProp) {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={placeholder}
                    type="text"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    className={fieldState.error ? "errorTextField" : ""}
                />
            )}
        />
    );
}