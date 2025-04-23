import { useState } from 'react';
import { Link } from 'react-router';
import { SerieModel } from '@/models/serie';
import { StorageService } from '@/services/storage';

function SerieList() {
    const [series, setSeries] = useState<SerieModel[]>(() => {
        const storedSeries = StorageService.getAllSeries();
        return storedSeries.length > 0 ? storedSeries : [];
    });

    const loadSeries = () => {
        const seriesData = StorageService.getAllSeries();
        setSeries(seriesData);
    };

    const handleDelete = (code: string) => {
        if (
            window.confirm('¿Estás seguro de que deseas eliminar esta serie?')
        ) {
            StorageService.deleteSerie(code);
            loadSeries();
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Listado de Series</h2>
            <Link to="/series/new" className="btn-primary inline-block mb-6">
                Nueva Serie
            </Link>

            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha de Estreno</th>
                            <th>Fecha de Finalización</th>
                            <th>Actores</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {series.map((serie) => (
                            <tr key={serie.code}>
                                <td className="font-medium text-gray-900">
                                    {serie.name}
                                </td>
                                <td>
                                    {serie.releaseDate.toLocaleDateString()}
                                </td>
                                <td>{serie.endDate.toLocaleDateString()}</td>
                                <td>{serie.actors.length}</td>
                                <td>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/series/view/${serie.code}`}
                                            className="btn-info btn-sm"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            to={`/series/edit/${serie.code}`}
                                            className="btn-warning btn-sm"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(serie.code)
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

export default SerieList;
