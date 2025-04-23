import { ActorModel } from '@/models/actor';
import { SerieModel } from '@/models/serie';
import { StorageService } from '@/services/storage';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';

function ActorView() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [actor, setActor] = useState<ActorModel | null>(null);
    const [actorSeries, setActorSeries] = useState<SerieModel[]>([]);

    useEffect(() => {
        if (code) {
            const actorData = StorageService.getActorByCode(code);
            if (actorData) {
                setActor(actorData);

                // Get series this actor appears in
                const series = StorageService.getSeriesByActorCode(code);
                setActorSeries(series);
            } else {
                alert('Actor no encontrado');
                navigate('/actors');
            }
        }
    }, [code, navigate]);

    if (!actor) {
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
                            src={actor.urlImage}
                            alt={actor.name}
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
                            {actor.name}
                        </h2>
                        <p className="mb-2">
                            <span className="font-semibold">
                                Fecha de Nacimiento:
                            </span>{' '}
                            {actor.birthDate.toLocaleDateString()}
                        </p>
                        <p className="mb-4">
                            <span className="font-semibold">
                                Lugar de Nacimiento:
                            </span>{' '}
                            {actor.placeOfBirth}
                        </p>
                        <p className="mb-6">
                            <a
                                href={actor.urlIMDB}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Ver en IMDB
                            </a>
                        </p>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-3">
                                Series:
                            </h4>
                            {actorSeries.length > 0 ? (
                                <div className="space-y-2">
                                    {actorSeries.map((serie) => (
                                        <div
                                            key={serie.code}
                                            className="bg-gray-100 p-3 rounded-lg"
                                        >
                                            <Link
                                                to={`/series/view/${serie.code}`}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                {serie.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Este actor no participa en ninguna serie
                                    registrada.
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                to={`/actors/edit/${actor.code}`}
                                className="btn-warning"
                            >
                                Editar
                            </Link>
                            <Link to="/actors" className="btn-secondary">
                                Volver al Listado
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActorView;
