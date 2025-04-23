import { Link } from 'react-router';

function NavBar() {
    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link className="font-bold text-lg" to="/">
                        SAA | Juan Castañeda - Daniel Chavez
                    </Link>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <Link
                                className="hover:bg-gray-700 px-3 py-2 rounded"
                                to="/"
                            >
                                Inicio
                            </Link>
                            <Link
                                className="hover:bg-gray-700 px-3 py-2 rounded"
                                to="/actors"
                            >
                                Actores
                            </Link>
                            <Link
                                className="hover:bg-gray-700 px-3 py-2 rounded"
                                to="/series"
                            >
                                Series
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            className="mobile-menu-button p-2"
                            aria-label="Mobile menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className="md:hidden hidden mobile-menu">
                <Link className="block hover:bg-gray-700 px-3 py-2" to="/">
                    Inicio
                </Link>
                <Link
                    className="block hover:bg-gray-700 px-3 py-2"
                    to="/actors"
                >
                    Actores
                </Link>
                <Link
                    className="block hover:bg-gray-700 px-3 py-2"
                    to="/series"
                >
                    Series
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
