import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

export default function Layout() {
    return (
        <>
            <main className="pt-12 pb-20 lg:ml-64 relative">
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
