import { NavLink } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";

const NavItems = () => {
    return (
        <>
            <li>
                <NavLink to="/" className="flex items-center gap-1 text-neutral-300">
                    Hem
                </NavLink>
            </li>
            <li>
                <NavLink to="/new-post" className="flex items-center gap-1 text-neutral-300">
                    Nytt
                </NavLink>
            </li>
            <li>
                <NavLink to="/search" className="flex items-center gap-1 text-neutral-300">
                    Sök
                </NavLink>
            </li>
            <li>
                <NavLink to="/profile" className="flex items-center gap-1 text-neutral-300">
                    Profil
                </NavLink>
            </li>
        </>
    );
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed w-full py-4 bg-neutral-800/50 backdrop-blur-xl border-b border-white/10 text-sm">
                <div className="content">
                    <ul className="hidden sm:flex justify-end gap-12 items-center">
                        <NavItems />
                    </ul>
                    <IoIosMenu
                        size={32}
                        className="sm:hidden ml-auto cursor-pointer"
                        role="button"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </nav>

            <div
                className={`fixed ${
                    isOpen ? "right-0" : "-right-full"
                }  bg-neutral-800 h-screen w-full flex items-center px-4 transition-right duration-300 ease-in-out`}
            >
                <IoCloseOutline
                    size={32}
                    className="absolute top-5 cursor-pointer"
                    role="button"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <ul className="flex flex-col gap-8 text-xl">
                    <NavItems />
                </ul>
            </div>
        </>
    );
}
