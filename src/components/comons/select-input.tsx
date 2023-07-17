import { GET } from "@/utitls/fetch-api";
import { ApiResponse } from "@/utitls/responde-DTO";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

type Option = {
    [key: string]: string | any;
}

type SelectInputProps = {
    name: string;
    placeholder: string;
    fieldValue: string;
    fieldLabel: string;
    options?: Option[];
    apiEndPoint?: string;
}

function useOptions(url: string, callBack: Function) {
    return useQuery({
        queryKey: [`${url}`],
        queryFn: () => GET(`${url}`)
            .then((res: ApiResponse<any>) => res)
            .then((option: { data: any, total: number }) => option.data || []),
        onSuccess(option) {
            callBack(option)
        },
        refetchOnMount: true
    })
}

export default function SelectInput({
    name,
    placeholder,
    fieldValue,
    fieldLabel,
    options,
    apiEndPoint
}: SelectInputProps) {
    const [selectOptions, setSelectOptions] = useState<Option[]>([]);
    const { control } = useFormContext()

    useOptions(apiEndPoint || "", (newOption: Option[]) => {
        setSelectOptions(newOption)
    })

    useEffect(() => {
        if (options) {
            setSelectOptions(options);
            return
        }
    }, [options])

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel>{placeholder}</InputLabel>
                    <Select
                        {...field}
                        label={placeholder}
                        type="text"
                        error={!!fieldState.error}
                    >
                        {selectOptions?.map((option) => (
                            <MenuItem key={option[fieldValue]} value={option[fieldValue]}>{option[fieldLabel]}</MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && <FormHelperText className="errorHelperText" error>
                        {fieldState.error?.message}
                    </FormHelperText>}
                </FormControl>
            )}
        />
    )
}