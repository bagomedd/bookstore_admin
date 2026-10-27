import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { IDatasource, GridReadyEvent, GridApi, ColDef, ColumnState } from "ag-grid-community";
import { useLazyPublishersQuery, useDeletePublisherMutation } from "@entities/publisher/api/publisherApi";
import { PublisherFields, type Publisher } from "@entities/publisher/model/publisher";
import { ActionCellRenderer } from "@shared/ui/ActionCellRenderer";
import { PublisherModal } from "./PublisherModal";
import { DeleteConfirmModal } from "@shared/ui/DeleteConfirmModal";

interface PublisherFilters {
    publisherName?: string;
    limit?: number;
}

export function PublishersTable() {
    const [filters, setFilters] = useState<PublisherFilters>({ limit: 50 });

    const filtersRef = useRef<PublisherFilters>(filters);
    const sortModelRef = useRef<{ colId: string; sort: "asc" | "desc" } | null>(null);
    const gridApiRef = useRef<GridApi | null>(null);

    const [triggerGetPublishers] = useLazyPublishersQuery();
    const [deletePublisher, { isLoading: isDeleting }] = useDeletePublisherMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [publisherToDelete, setPublisherToDelete] = useState<Publisher | null>(null);

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
                        const data = await triggerGetPublishers({
                            limit: currentLimit,
                            offset: currentOffset,
                            publisherName: currentFilters.publisherName || undefined,
                            sortBy: currentSort?.colId,
                            sortOrder: currentSort?.sort,
                        }).unwrap();

                        const lastRow = data.length < currentLimit ? params.startRow + data.length : -1;
                        params.successCallback(data, lastRow);
                    } catch (err) {
                        console.error("Failed to fetch publishers:", err);
                        params.failCallback();
                    }
                },
            };

            params.api.setGridOption("datasource", datasource);
        },
        [triggerGetPublishers],
    );

    const handleCreate = () => {
        setSelectedPublisher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (publisher: Publisher) => {
        setSelectedPublisher(publisher);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (publisher: Publisher) => {
        setPublisherToDelete(publisher);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!publisherToDelete) return;
        try {
            await deletePublisher(publisherToDelete.id).unwrap();
            setIsDeleteModalOpen(false);
            setPublisherToDelete(null);
            if (gridApiRef.current) {
                gridApiRef.current.purgeInfiniteCache();
            }
        } catch (err) {
            console.error("Failed to delete publisher:", err);
        }
    };

    const columnDefs: ColDef[] = useMemo(
        () => [
            { field: PublisherFields.publisherName, headerName: "Издательство", flex: 2 },
            { field: PublisherFields.contractStartDate, headerName: "Дата договора", flex: 1 },
            { field: PublisherFields.contractEndDate, headerName: "Дата завершения", flex: 1 },
            { field: PublisherFields.totalBooks, headerName: "Количество книг", flex: 1 },
            { field: PublisherFields.totalTurnover, headerName: "Оборот", flex: 2 },
            {
                headerName: "Действия",
                flex: 1.5,
                cellRenderer: ActionCellRenderer,
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Издательства</h2>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                    Добавить издательство
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg items-center">
                <div className="flex-1 min-w-50">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Поиск по названию</label>
                    <input
                        type="text"
                        value={filters.publisherName || ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, publisherName: e.target.value }))}
                        placeholder="Введите название..."
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

            <PublisherModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    gridApiRef.current?.purgeInfiniteCache();
                }}
                publisher={selectedPublisher}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Удалить издательство"
                message={`Вы уверены, что хотите удалить издательство "${publisherToDelete?.publisherName}"?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
