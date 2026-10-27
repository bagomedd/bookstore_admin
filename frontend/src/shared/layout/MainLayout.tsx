import type { ReactNode } from "react";

interface MainLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
}

export function MainLayout(props: MainLayoutProps) {
    return (
        <>
            <div className="flex min-h-screen bg-bg-main">
                {props.sidebar}
                <main className="flex-1 p-8 overflow-auto">{props.content}</main>
            </div>
        </>
    );
}
