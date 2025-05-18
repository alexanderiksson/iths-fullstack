import { NavLink } from "react-router-dom";
import { GoHomeFill, GoSearch } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="py-4">
            <div className="content">
                <ul className="flex justify-end gap-20 items-center">
                    <li>
                        <NavLink to="/" className="flex items-center gap-1">
                            <GoHomeFill size={24} /> Hem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" className="flex items-center gap-1">
                            <GoSearch size={24} /> Sök
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className="flex items-center gap-1">
                            <FaUserCircle size={24} /> Profil
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
