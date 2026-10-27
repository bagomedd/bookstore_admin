import LogoIcon from "@mui/icons-material/Abc";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export function Sidebar() {
    return (
        <aside className="w-70 min-h-screen bg-sidebar-bg text-text-main flex flex-col shadow-xl">
            <div className="flex items-center gap-3 p-6 border-b text-text-main">
                <LogoIcon className="text-primary-cyan " fontSize="large" />
                <span className="text-xl font-bold tracking-wider"> Dashboard </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <ul>
                    <li className="px-4 py-3 hover:bg-gray-800 text-primary-cyan rounded-lg cursor-pointer transition-colors">
                        <AccountBalanceIcon /> Аналитика поставок
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                        <AccountCircleIcon /> Профиль
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
