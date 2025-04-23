import { ActorModel } from '@/models/actor';
import { SerieModel } from '@/models/serie';
import { StorageService } from '@/services/storage';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';

function SerieView() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [serie, setSerie] = useState<SerieModel | null>(null);
    const [serieActors, setSerieActors] = useState<ActorModel[]>([]);

    useEffect(() => {
        if (code) {
            const serieData = StorageService.getSerieByCode(code);
            if (serieData) {
                setSerie(serieData);

                // Get actors in this serie
                const actors = StorageService.getActorsBySerieCode(code);
                setSerieActors(actors);
            } else {
                alert('Serie no encontrada');
                navigate('/series');
            }
        }
    }, [code, navigate]);

    if (!serie) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 h-96 flex items-center justify-center">
                        <img
                            src={serie.urlImage}
                            alt={serie.name}
                            className="w-full h-auto object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                    'https://via.placeholder.com/300x450?text=No+Image';
                            }}
                        />
                    </div>
                    <div className="p-6 md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">
                            {serie.name}
                        </h2>
                        <p className="mb-2">
                            <span className="font-semibold">
                                Fecha de Estreno:
                            </span>{' '}
                            {serie.releaseDate.toLocaleDateString()}
                        </p>
                        <p className="mb-4">
                            <span className="font-semibold">
                                Fecha de Finalización:
                            </span>{' '}
                            {serie.endDate.toLocaleDateString()}
                        </p>
                        <p className="mb-6">
                            <a
                                href={serie.urlIMDB}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Ver en IMDB
                            </a>
                        </p>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-3">
                                Actores:
                            </h4>
                            {serieActors.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {serieActors.map((actor) => (
                                        <div
                                            key={actor.code}
                                            className="bg-gray-100 p-3 rounded-lg flex items-center"
                                        >
                                            <img
                                                src={actor.urlImage}
                                                alt={actor.name}
                                                className="w-12 h-12 rounded-full object-cover mr-3"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        'https://via.placeholder.com/48?text=NA';
                                                }}
                                            />
                                            <Link
                                                to={`/actors/view/${actor.code}`}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                {actor.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Esta serie no tiene actores registrados.
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                to={`/series/edit/${serie.code}`}
                                className="btn-warning"
                            >
                                Editar
                            </Link>
                            <Link to="/series" className="btn-secondary">
                                Volver al Listado
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SerieView;
