import { ActorModel } from '@/models/actor';
import { SerieModel } from '@/models/serie';
import { StorageService } from '@/services/storage';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

interface SerieFormProps {
    isEditing?: boolean;
}

function SerieForm({ isEditing = false }: SerieFormProps) {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [allActors, setAllActors] = useState<ActorModel[]>([]);
    const [selectedActors, setSelectedActors] = useState<string[]>([]);

    const [serie, setSerie] = useState<SerieModel>(
        new SerieModel('', '', '', '', new Date(), new Date(), [])
    );

    useEffect(() => {
        // Load all actors for selection
        setAllActors(StorageService.getAllActors());

        // If editing, load the serie data
        if (isEditing && code) {
            const serieData = StorageService.getSerieByCode(code);
            if (serieData) {
                setSerie(serieData);
                setSelectedActors(serieData.actors);
            } else {
                alert('Serie no encontrada');
                navigate('/series');
            }
        }
    }, [code, isEditing, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setSerie({ ...serie, [name]: value });
    };

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        dateField: 'releaseDate' | 'endDate'
    ) => {
        const date = new Date(e.target.value);
        setSerie({ ...serie, [dateField]: date });
    };

    const handleActorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const values: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setSelectedActors(values);
        setSerie({ ...serie, actors: values });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If not editing, generate a new code
        serie.actors = selectedActors;

        if (!isEditing) {
            serie.code = `S${Date.now()}`;
            StorageService.saveSerie(serie);
        } else {
            StorageService.updateSerie(serie);
        }

        navigate('/series');
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">
                {isEditing ? 'Editar Serie' : 'Nueva Serie'}
            </h2>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="form-label">
                            Nombre
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={serie.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="urlIMDB" className="form-label">
                            URL IMDB
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            id="urlIMDB"
                            name="urlIMDB"
                            value={serie.urlIMDB}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="urlImage" className="form-label">
                            URL Imagen
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            id="urlImage"
                            name="urlImage"
                            value={serie.urlImage}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="releaseDate" className="form-label">
                            Fecha de Estreno
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="releaseDate"
                            name="releaseDate"
                            value={
                                serie.releaseDate.toISOString().split('T')[0]
                            }
                            onChange={(e) => handleDateChange(e, 'releaseDate')}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="endDate" className="form-label">
                            Fecha de Finalización
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            name="endDate"
                            value={serie.endDate.toISOString().split('T')[0]}
                            onChange={(e) => handleDateChange(e, 'endDate')}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="actors" className="form-label">
                            Actores
                        </label>
                        <select
                            multiple
                            className="form-select h-32"
                            id="actors"
                            name="actors"
                            value={selectedActors}
                            onChange={handleActorsChange}
                        >
                            {allActors.map((actor) => (
                                <option key={actor.code} value={actor.code}>
                                    {actor.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Mantén presionado Ctrl (o Cmd) para seleccionar
                            múltiples opciones
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button type="submit" className="btn-primary">
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/series')}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SerieForm;
