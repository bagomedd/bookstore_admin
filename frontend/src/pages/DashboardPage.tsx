import { EditionsTable } from "@features/editionsGrid/EditionsGrid";
import { PublishersTable } from "@features/publishersGrid/PublishersGrid";

export function DashboardPage() {
    return (
        <div>
            <PublishersTable />
            <EditionsTable />
        </div>
    );
}
