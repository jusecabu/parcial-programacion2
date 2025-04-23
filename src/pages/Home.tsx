import { Link } from 'react-router';

function Home() {
    return (
        <div className="container mx-auto px-4 mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">
                Gestión de Actores y Series
            </h1>
            <p className="text-lg text-center text-gray-600 mb-10">
                Selecciona una de las opciones para administrar tus datos
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h5 className="text-xl font-semibold mb-3">Actores</h5>
                    <p className="text-gray-600 mb-4">
                        Administra el catálogo de actores
                    </p>
                    <Link to="/actors" className="btn-primary inline-block">
                        Ir a Actores
                    </Link>
                </div>

                <div className="card p-6">
                    <h5 className="text-xl font-semibold mb-3">Series</h5>
                    <p className="text-gray-600 mb-4">
                        Administra el catálogo de series
                    </p>
                    <Link to="/series" className="btn-primary inline-block">
                        Ir a Series
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default Home;
