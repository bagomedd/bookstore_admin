import { Modal } from "@shared/ui/Modal";
import type { Publisher } from "@entities/publisher/model/publisher";
import { useCreatePublisherMutation, useUpdatePublisherMutation } from "@entities/publisher/api/publisherApi";

interface PublisherModalProps {
    isOpen: boolean;
    onClose: () => void;
    publisher?: Publisher | null;
}

export function PublisherModal({ isOpen, onClose, publisher }: PublisherModalProps) {
    const [createPublisher, { isLoading: isCreating }] = useCreatePublisherMutation();
    const [updatePublisher, { isLoading: isUpdating }] = useUpdatePublisherMutation();

    const handleSubmit = async (formData: FormData) => {
        const publisherName = formData.get("publisherName") as string;
        const contractStartDate = formData.get("contractStartDate") as string;
        const contractEndDate = formData.get("contractEndDate") as string;
        const totalTurnover = formData.get("totalTurnover") as string;

        try {
            if (publisher) {
                await updatePublisher({
                    id: publisher.id,
                    body: { publisherName, contractStartDate, contractEndDate, totalTurnover },
                }).unwrap();
            } else {
                await createPublisher({
                    publisherName,
                    contractStartDate,
                    contractEndDate,
                    totalTurnover,
                }).unwrap();
            }
            onClose();
        } catch (err) {
            console.error("Failed to save publisher:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={publisher ? "Редактировать издательство" : "Добавить издательство"}>
            <form action={handleSubmit} className="space-y-4" key={publisher ? publisher.id : "new-publisher"}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название издательства</label>
                    <input
                        type="text"
                        name="publisherName"
                        required
                        defaultValue={publisher?.publisherName || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="Введите название"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала договора</label>
                    <input
                        type="date"
                        name="contractStartDate"
                        required
                        defaultValue={publisher?.contractStartDate || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания договора</label>
                    <input
                        type="date"
                        name="contractEndDate"
                        required
                        defaultValue={publisher?.contractEndDate || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Оборот</label>
                    <input
                        type="number"
                        step="0.01"
                        name="totalTurnover"
                        required
                        defaultValue={publisher?.totalTurnover || "0.00"}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="0.00"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="px-4 py-2 bg-primary-cyan text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        {publisher ? "Сохранить" : "Создать"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
