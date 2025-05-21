import { NavLink } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed w-full py-4 bg-neutral-800/50 backdrop-blur-xl border-b border-white/10 text-sm">
                <div className="content">
                    <ul className="flex justify-end gap-4 sm:gap-12 items-center">
                        <li>
                            <NavLink
                                to="/"
                                className="hidden sm:flex items-center gap-1 text-neutral-300"
                            >
                                Hem
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/new-post"
                                className="hidden sm:flex items-center gap-1 text-neutral-300"
                            >
                                Nytt
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/search"
                                className="hidden sm:flex items-center gap-1 text-neutral-300"
                            >
                                Sök
                            </NavLink>
                        </li>

                        <li className="sm:hidden">
                            <IoIosMenu
                                size={32}
                                className="cursor-pointer"
                                role="button"
                                onClick={() => setIsOpen(!isOpen)}
                            />
                        </li>

                        <li>
                            <NavLink
                                to="/profile"
                                className="flex items-center gap-1 text-neutral-300"
                            >
                                <img
                                    src="/profileplaceholder.jpg"
                                    width={32}
                                    className="rounded-full"
                                    alt=""
                                />
                            </NavLink>
                        </li>
                    </ul>
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
                <ul className="flex flex-col gap-8 text-3xl" onClick={() => setIsOpen(false)}>
                    <li>
                        <NavLink to="/" className="flex items-center gap-1 text-neutral-300">
                            Hem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/new-post"
                            className="flex items-center gap-1 text-neutral-300"
                        >
                            Nytt
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className="flex items-center gap-1 text-neutral-300">
                            Sök
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}
