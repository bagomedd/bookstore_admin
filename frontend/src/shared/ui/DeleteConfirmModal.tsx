import { Modal } from "./Modal";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }: DeleteConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-gray-700">{message}</p>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        Отмена
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning transition-colors disabled:opacity-50"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </Modal>
    );
}
