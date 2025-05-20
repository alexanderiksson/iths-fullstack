import { NavLink } from "react-router-dom";
import { GoHome, GoPlus } from "react-icons/go";
import { GrSearch } from "react-icons/gr";
import { LuUser } from "react-icons/lu";

export default function Navbar() {
    return (
        <nav className="fixed w-full py-4 bg-neutral-800/50 backdrop-blur-xl border-b border-white/10 text-sm">
            <div className="content">
                <ul className="flex justify-end gap-12 items-center">
                    <li>
                        <NavLink to="/" className="flex items-center gap-1 text-neutral-300">
                            <GoHome size={18} /> Hem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/new-post"
                            className="flex items-center gap-1 text-neutral-300"
                        >
                            <GoPlus size={22} /> Nytt
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className="flex items-center gap-1 text-neutral-300">
                            <GrSearch size={16} /> Sök
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className="flex items-center gap-1 text-neutral-300">
                            <LuUser size={18} />
                            Profil
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
