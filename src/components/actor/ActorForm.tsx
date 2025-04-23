import { ActorModel } from '@/models/actor';
import { SerieModel } from '@/models/serie';
import { StorageService } from '@/services/storage';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

interface ActorFormProps {
    isEditing?: boolean;
}

function ActorForm({ isEditing = false }: ActorFormProps) {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [allSeries, setAllSeries] = useState<SerieModel[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);

    const [actor, setActor] = useState<ActorModel>(
        new ActorModel('', '', '', '', new Date(), '', [])
    );

    useEffect(() => {
        // Load all series for selection
        setAllSeries(StorageService.getAllSeries());

        // If editing, load the actor data
        if (isEditing && code) {
            const actorData = StorageService.getActorByCode(code);
            if (actorData) {
                setActor(actorData);
                setSelectedSeries(actorData.series);
            } else {
                alert('Actor no encontrado');
                navigate('/actors');
            }
        }
    }, [code, isEditing, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setActor({ ...actor, [name]: value });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const birthDate = new Date(e.target.value);
        setActor({ ...actor, birthDate });
    };

    const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const values: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setSelectedSeries(values);
        setActor({ ...actor, series: values });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If not editing, generate a new code
        if (!isEditing) {
            actor.code = `A${Date.now()}`;
        }

        actor.series = selectedSeries;
        StorageService.saveActor(actor);
        navigate('/actors');
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">
                {isEditing ? 'Editar Actor' : 'Nuevo Actor'}
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
                            value={actor.name}
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
                            value={actor.urlIMDB}
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
                            value={actor.urlImage}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className="form-label">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="birthDate"
                            name="birthDate"
                            value={actor.birthDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="placeOfBirth" className="form-label">
                            Lugar de Nacimiento
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="placeOfBirth"
                            name="placeOfBirth"
                            value={actor.placeOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="series" className="form-label">
                            Series
                        </label>
                        <select
                            multiple
                            className="form-select h-32"
                            id="series"
                            name="series"
                            value={selectedSeries}
                            onChange={handleSeriesChange}
                        >
                            {allSeries.map((serie) => (
                                <option key={serie.code} value={serie.code}>
                                    {serie.name}
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
                            onClick={() => navigate('/actors')}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ActorForm;
