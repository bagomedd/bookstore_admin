import type { CustomCellRendererProps } from "ag-grid-react";

interface ActionCellParams<T = unknown> extends CustomCellRendererProps {
    onEdit?: (data: T) => void;
    onDelete?: (data: T) => void;
}

export function ActionCellRenderer<T = unknown>(props: ActionCellParams<T>) {
    const { data, onEdit, onDelete } = props;

    return (
        <div className="flex items-center gap-2 h-full py-1">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(data);
                }}
                className="px-2 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors font-medium flex items-center gap-1 cursor-pointer"
                title="Редактировать"
            >
                Изменить
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(data);
                }}
                className="px-2 py-1 text-sm bg-red-50 text-warning hover:bg-red-100 rounded-md transition-colors font-medium flex items-center gap-1 cursor-pointer"
                title="Удалить"
            >
                Удалить
            </button>
        </div>
    );
}
