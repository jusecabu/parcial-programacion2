import { ActorModel } from '@/models/actor';
import { StorageService } from '@/services/storage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';

function ActorList() {
    const [actors, setActors] = useState<ActorModel[]>([]);

    useEffect(() => {
        loadActors();
    }, []);

    const loadActors = () => {
        const actorData = StorageService.getAllActors();
        setActors(actorData);
    };

    const handleDelete = (code: string) => {
        if (
            window.confirm('¿Estás seguro de que deseas eliminar este actor?')
        ) {
            // Verificar que los actores no pertenezcan a una serie
            const series = StorageService.getSeriesByActorCode(code);

            if (series.length > 0) {
                alert(
                    'No se puede eliminar el actor porque pertenece a una serie. Por favor, elimine el actor de la serie primero.'
                );
                return;
            }

            // Eliminar el actor
            StorageService.deleteActor(code);
            loadActors();
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Listado de Actores</h2>
            <Link to="/actors/new" className="btn-primary inline-block mb-6">
                Nuevo Actor
            </Link>

            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Lugar de Nacimiento</th>
                            <th>Series</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {actors.map((actor) => (
                            <tr key={actor.code}>
                                <td className="font-medium text-gray-900">
                                    {actor.name}
                                </td>
                                <td>{actor.birthDate.toLocaleDateString()}</td>
                                <td>{actor.placeOfBirth}</td>
                                <td>{actor.series.length}</td>
                                <td>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/actors/view/${actor.code}`}
                                            className="btn-info btn-sm"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            to={`/actors/edit/${actor.code}`}
                                            className="btn-warning btn-sm"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(actor.code)
                                            }
                                            className="btn-danger btn-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ActorList;
