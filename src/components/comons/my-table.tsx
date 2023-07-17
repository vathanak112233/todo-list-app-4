import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TableFooter
} from "@mui/material";
import { ReactNode } from "react";

type TypeColumn = "number" | "text" | "date" | "date-time" | "currency";

type Action<T> = {
    label: string;
    icon: ReactNode;
    color?: "inherit" | "default" | "primary" | "secondary" | "error";
    onClick: (item: T) => void;
}

export type ColumnTable<T> = {
    key: keyof T & (string) | string;
    label: string;
    align?: "left" | "right" | "center";
    type?: TypeColumn;
    actions?: Action<T>[];
}

type TableProps<T> = {
    columns: ColumnTable<T>[];
    data: T[]
}

function getColumnValue<T>(item: T, key: keyof T & (string) | string): string {
    const nestedKeys = key.split(".");
    let value: any = item;
    for (const nestedKey of nestedKeys) {
        value = value[nestedKey];
        if (!value) break;
    }
    return value ? String(value) : "";
}

export default function MyTable<T>({ columns, data }: TableProps<T>) {
    const handleAction = (item: T, action?: (item: T) => void) => {
        if (action) {
            action(item);
        }
    }

    // const transformValue = (value, column) => {

    // }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key} align={column.align || "left"}>{column.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell key={column.key} align={column.align || "left"}>
                                    {column.actions ? (
                                        <>
                                            {column.actions.map((action, actionIndex) => (
                                                <IconButton
                                                    key={actionIndex}
                                                    aria-label={column.label}
                                                    color={action.color || "default"}
                                                    onClick={() => handleAction(item, action.onClick)}>
                                                    {action.icon}
                                                </IconButton>
                                            ))}
                                        </>
                                    ) : getColumnValue(item, column.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow></TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}