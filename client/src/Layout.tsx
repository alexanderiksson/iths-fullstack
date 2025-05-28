import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

export default function Layout() {
    return (
        <>
            <main className="pt-24 pb-12 lg:ml-64 relative">
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
