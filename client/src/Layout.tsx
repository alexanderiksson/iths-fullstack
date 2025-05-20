import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="pt-24 flex-1">
                <Outlet />
            </main>
        </>
    );
}
