import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { IDatasource, GridReadyEvent, GridApi, ColDef, ColumnState } from "ag-grid-community";
import { useLazyEditionsQuery, useDeleteEditionMutation } from "@entities/edition/api/editionApi";
import { EditionFields, type Edition } from "@entities/edition/model/edition";
import { ActionCellRenderer } from "@shared/ui/ActionCellRenderer";
import { EditionModal } from "./EditionModal";
import { DeleteConfirmModal } from "@shared/ui/DeleteConfirmModal";

interface EditionFilters {
    title?: string;
    author?: string;
    publisherName?: string;
    limit?: number;
}

export function EditionsTable() {
    const [filters, setFilters] = useState<EditionFilters>({ limit: 50 });

    const filtersRef = useRef<EditionFilters>(filters);
    const sortModelRef = useRef<{ colId: string; sort: "asc" | "desc" } | null>(null);
    const gridApiRef = useRef<GridApi | null>(null);

    const [triggerGetEditions] = useLazyEditionsQuery();
    const [deleteEdition, { isLoading: isDeleting }] = useDeleteEditionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editionToDelete, setEditionToDelete] = useState<Edition | null>(null);

    useEffect(() => {
        filtersRef.current = filters;
        if (gridApiRef.current) {
            gridApiRef.current.purgeInfiniteCache();
        }
    }, [filters]);

    const onSortChanged = useCallback(() => {
        if (gridApiRef.current) {
            const columnState = gridApiRef.current.getColumnState();
            const sortedCol = columnState.find((col: ColumnState) => col.sort != null);

            sortModelRef.current = sortedCol && sortedCol.sort ? { colId: sortedCol.colId, sort: sortedCol.sort } : null;
            gridApiRef.current.purgeInfiniteCache();
        }
    }, []);

    const onGridReady = useCallback(
        (params: GridReadyEvent) => {
            gridApiRef.current = params.api;

            const datasource: IDatasource = {
                getRows: async (params) => {
                    const currentLimit = params.endRow - params.startRow;
                    const currentOffset = params.startRow;

                    const currentFilters = filtersRef.current;
                    const currentSort = sortModelRef.current;

                    try {
                        const data = await triggerGetEditions({
                            limit: currentLimit,
                            offset: currentOffset,
                            title: currentFilters.title || undefined,
                            author: currentFilters.author || undefined,
                            publisherName: currentFilters.publisherName || undefined,
                            sortBy: currentSort?.colId,
                            sortOrder: currentSort?.sort,
                        }).unwrap();

                        const lastRow = data.length < currentLimit ? params.startRow + data.length : -1;
                        params.successCallback(data, lastRow);
                    } catch (err) {
                        console.error("Failed to fetch editions:", err);
                        params.failCallback();
                    }
                },
            };

            params.api.setGridOption("datasource", datasource);
        },
        [triggerGetEditions],
    );

    const handleCreate = () => {
        setSelectedEdition(null);
        setIsModalOpen(true);
    };

    const handleEdit = (edition: Edition) => {
        setSelectedEdition(edition);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (edition: Edition) => {
        setEditionToDelete(edition);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!editionToDelete) return;
        try {
            await deleteEdition(editionToDelete.id).unwrap();
            setIsDeleteModalOpen(false);
            setEditionToDelete(null);
            if (gridApiRef.current) {
                gridApiRef.current.purgeInfiniteCache();
            }
        } catch (err) {
            console.error("Failed to delete edition:", err);
        }
    };

    const columnDefs: ColDef[] = useMemo(
        () => [
            { field: EditionFields.title, headerName: "Название", flex: 2 },
            { field: EditionFields.author, headerName: "Автор", flex: 2 },
            { field: EditionFields.publisherName, headerName: "Издательство", flex: 1.5 },
            { field: EditionFields.price, headerName: "Цена", flex: 1 },
            { field: EditionFields.copiesSold, headerName: "Продано", flex: 1 },
            {
                headerName: "Действия",
                flex: 1.5,
                cellRenderer: ActionCellRenderer<Edition>,
                cellRendererParams: {
                    onEdit: handleEdit,
                    onDelete: handleDeleteClick,
                },
                sortable: false,
                filter: false,
            },
        ],
        [],
    );

    const defaultColDef: ColDef = useMemo(
        () => ({
            sortable: true,
            filter: false,
            resizable: true,
        }),
        [],
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Книги / Издания</h2>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                    Добавить книгу
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg items-center">
                <div className="flex-1 min-w-45">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Поиск по названию</label>
                    <input
                        type="text"
                        value={filters.title || ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Название книги..."
                        className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    />
                </div>
                <div className="flex-1 min-w-45">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Поиск по автору</label>
                    <input
                        type="text"
                        value={filters.author || ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Автор..."
                        className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    />
                </div>
                <div className="flex-1 min-w-45">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Поиск по издательству</label>
                    <input
                        type="text"
                        value={filters.publisherName || ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, publisherName: e.target.value }))}
                        placeholder="Издательство..."
                        className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    />
                </div>
            </div>

            <div className="ag-theme-alpine w-full h-100">
                <AgGridReact
                    rowModelType="infinite"
                    cacheBlockSize={filters.limit}
                    onGridReady={onGridReady}
                    onSortChanged={onSortChanged}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                />
            </div>

            <EditionModal
                isOpen={isModalOpen}
                onClose={() => {
                    gridApiRef.current?.purgeInfiniteCache();
                    setIsModalOpen(false);
                }}
                edition={selectedEdition}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Удалить книгу"
                message={`Вы уверены, что хотите удалить книгу "${editionToDelete?.title}"?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
