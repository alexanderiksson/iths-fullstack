import { NavLink } from "react-router-dom";
import { GoHome, GoPlus } from "react-icons/go";
import { GrSearch } from "react-icons/gr";
import { LuUser } from "react-icons/lu";

export default function Navbar() {
    return (
        <nav className="py-4">
            <div className="content">
                <ul className="flex justify-end gap-20 items-center">
                    <li>
                        <NavLink to="/" className="flex items-center gap-2">
                            <GoHome size={20} /> Hem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/new-post" className="flex items-center gap-2">
                            <GoPlus size={23} /> Nytt
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className="flex items-center gap-2 ">
                            <GrSearch size={18} /> Sök
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className="flex items-center gap-2">
                            <LuUser size={21} />
                            Profil
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
