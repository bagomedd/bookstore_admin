import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { DashboardPage } from "@pages/DashboardPage";
import { MainLayout } from "@shared/layout/MainLayout";
import { Sidebar } from "@widgets/sidebar/Sidebar";

import "./AgGrid.modules";

function RootLayout() {
    return <MainLayout sidebar={<Sidebar />} content={<Outlet />} />;
}
function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<RootLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
