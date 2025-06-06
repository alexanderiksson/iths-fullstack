import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { NewpostModal } from "./Modals";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import Error from "./Error";

const MobileNav = ({ onOpen }: { onOpen: () => void }) => {
    return (
        <nav className="fixed bottom-0 w-full py-4 bg-secondary/80 backdrop-blur-lg border-t border-white/5 flex lg:hidden">
            <ul className="flex justify-evenly w-full text-neutral-400/80">
                <li>
                    <NavLink to="/">
                        <FaHouse size={22} />
                    </NavLink>
                </li>
                <li>
                    <span onClick={onOpen} className="cursor-pointer">
                        <IoIosAddCircle size={24} />
                    </span>
                </li>
                <li>
                    <NavLink to="/search">
                        <IoSearch size={24} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile">
                        <FaUser size={22} />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const { data: user } = useFetch<User>("/api/users/me");

    if (!user) return <Error />;

    return (
        <>
            <NewpostModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                username={user.username}
                profilePicture={user?.profile_picture}
            />

            <div className="w-64 bg-secondary hidden lg:flex flex-col gap-16 fixed h-screen px-4 py-12 border border-white/10">
                <nav>
                    <ul className="flex flex-col gap-8 text-lg text-neutral-400/80">
                        <li>
                            <NavLink
                                to="/"
                                className="flex items-center gap-4 p-2 hover:bg-neutral-500/20 rounded-lg transition-colors"
                            >
                                <FaHouse size={22} /> Hem
                            </NavLink>
                        </li>
                        <li>
                            <span
                                className="flex items-center gap-4 p-2 hover:bg-neutral-500/20 rounded-lg transition-colors cursor-pointer"
                                onClick={() => setIsOpen(true)}
                            >
                                <IoIosAddCircle size={24} /> Nytt
                            </span>
                        </li>
                        <li>
                            <NavLink
                                to="/search"
                                className="flex items-center gap-4 p-2 hover:bg-neutral-500/20 rounded-lg transition-colors"
                            >
                                <IoSearch size={24} /> Sök
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/profile"
                                className="flex items-center gap-4 p-2 hover:bg-neutral-500/20 rounded-lg transition-colors"
                            >
                                <FaUser size={22} /> Profil
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            <MobileNav onOpen={() => setIsOpen(true)} />
        </>
    );
}
