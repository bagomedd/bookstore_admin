import { Modal } from "@shared/ui/Modal";
import type { Edition } from "@entities/edition/model/edition";
import { useCreateEditionMutation, useUpdateEditionMutation } from "@entities/edition/api/editionApi";
import { usePublishersQuery } from "@entities/publisher/api/publisherApi";

interface EditionModalProps {
    isOpen: boolean;
    onClose: () => void;
    edition?: Edition | null;
}

export function EditionModal({ isOpen, onClose, edition }: EditionModalProps) {
    const { data: publishers } = usePublishersQuery();

    const [createEdition, { isLoading: isCreating }] = useCreateEditionMutation();
    const [updateEdition, { isLoading: isUpdating }] = useUpdateEditionMutation();

    const handleSubmit = async (formData: FormData) => {
        const publisherId = formData.get("publisherId") as string;
        const author = formData.get("author") as string;
        const title = formData.get("title") as string;
        const price = formData.get("price") as string;
        const copiesSold = Number(formData.get("copiesSold"));

        try {
            if (edition) {
                await updateEdition({
                    id: edition.id,
                    body: { publisherId, author, title, price, copiesSold },
                }).unwrap();
            } else {
                await createEdition({
                    publisherId,
                    author,
                    title,
                    price,
                    copiesSold,
                }).unwrap();
            }
            onClose();
        } catch (err) {
            console.error("Failed to save edition:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={edition ? "Редактировать книгу" : "Добавить книгу"}>
            <form action={handleSubmit} className="space-y-4" key={edition ? edition.id : "new-edition"}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Издательство</label>
                    <select
                        name="publisherId"
                        required
                        defaultValue={edition?.publisherId || (publishers?.[0]?.id ?? "")}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    >
                        <option value="">Выберите издательство</option>
                        {publishers?.map((pub) => (
                            <option key={pub.id} value={pub.id}>
                                {pub.publisherName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Автор</label>
                    <input
                        type="text"
                        name="author"
                        required
                        defaultValue={edition?.author || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="Введите автора"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название книги</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={edition?.title || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="Введите название"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        required
                        defaultValue={edition?.price || ""}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Продано экземпляров</label>
                    <input
                        type="number"
                        name="copiesSold"
                        required
                        defaultValue={edition?.copiesSold ?? 0}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="0"
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
                        {edition ? "Сохранить" : "Создать"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
