import { useMemo } from "react";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface BaseTableProps<T> extends AgGridReactProps<T> {
    rowData: T[] | undefined;
    isLoading?: boolean;
}

export const BaseTable = <T,>({ rowData, isLoading, columnDefs, ...rest }: BaseTableProps<T>) => {
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            resizable: true,
        }),
        [],
    );

    if (isLoading) return <div>Загрузка...</div>;
    if (!rowData?.length) return <div>Нет данных</div>;

    return (
        <div className="ag-theme-alpine w-full h-full min-h-100px">
            <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} animateRows={true} {...rest} />
        </div>
    );
};
