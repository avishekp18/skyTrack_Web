import { useState } from "react";
import { Link } from "react-router-dom";
import { logowhite, close, menu } from "../assets/images";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="fixed inset-x-0 bg-[#000a18] flex items-center justify-between py-6 px-16 max-[750px]:px-10 max-[300px]:px-6 z-[200] shadow-md">
            {/* Mobile menu toggle */}
            <div className="hidden max-[750px]:flex items-center">
                <button
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    className="focus:outline-none"
                >
                    <img
                        src={isMenuOpen ? close : menu}
                        className="w-[22px] h-[22px] object-contain cursor-pointer transition-transform duration-200 hover:scale-110"
                        alt="menu icon"
                    />
                </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
                <img
                    src={logowhite}
                    alt="SkyTrack Logo"
                    className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-white text-xl font-semibold tracking-wide group-hover:text-blue-300 transition-colors duration-200">
                    SkyTrack
                </span>
            </Link>

            {/* Temperature unit selector (desktop) */}
            <div className="flex items-center space-x-8 max-[750px]:hidden">
                <button
                    name="metric"
                    className="text-xl text-white font-light hover:text-blue-300 transition"
                >
                    &deg;A
                </button>
                <span className="text-white text-xl">|</span>
                <button
                    name="imperial"
                    className="text-xl text-white font-light hover:text-blue-300 transition"
                >
                    &deg;P
                </button>
            </div>

            {/* Mobile menu drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[250px] bg-[#0c1f25]/90 backdrop-blur-xl transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-end p-6">
                    <button onClick={toggleMenu} aria-label="Close menu">
                        <img src={close} alt="close" className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu links */}
                <ul className="flex flex-col items-start space-y-4 px-6 mt-4">
                    <li>
                        <Link
                            to="/"
                            onClick={toggleMenu}
                            className="text-white text-lg hover:text-blue-300 transition"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            onClick={toggleMenu}
                            className="text-white text-lg hover:text-blue-300 transition"
                        >
                            Forecast
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            onClick={toggleMenu}
                            className="text-white text-lg hover:text-blue-300 transition"
                        >
                            About
                        </Link>
                    </li>
                </ul>

                {/* Mobile temp unit selector */}
                <div className="flex items-center space-x-2 px-6 mt-6">
                    <button
                        name="metric"
                        className="text-xl text-white font-light hover:text-blue-300 transition"
                    >
                        &deg;A
                    </button>
                    <span className="text-white text-xl">|</span>
                    <button
                        name="imperial"
                        className="text-xl text-white font-light hover:text-blue-300 transition"
                    >
                        &deg;P
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
