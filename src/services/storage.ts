import { ActorModel } from '@/models/actor';
import { SerieModel } from '@/models/serie';

export class StorageService {
    private static readonly ACTORS_KEY = 'actors';
    private static readonly SERIES_KEY = 'series';
    private static readonly APP_INITIALIZED_KEY = 'app_initialized';

    // ACTOR METHODS

    /**
     * Save an actor to localStorage and update related series
     */
    public static saveActor(actor: ActorModel): void {
        const actors = this.getAllActors();
        const existingActor = actors.find((a) => a.code === actor.code);
        const isNew = !existingActor;

        // If updating an existing actor, we need to handle removed series relationships
        if (!isNew && existingActor) {
            // Find series that were removed from the actor
            const removedSeries = existingActor.series.filter(
                (serieCode) => !actor.series.includes(serieCode)
            );

            // Remove actor from those series
            removedSeries.forEach((serieCode) => {
                const serie = this.getSerieByCode(serieCode);
                if (serie) {
                    serie.actors = serie.actors.filter(
                        (actorCode) => actorCode !== actor.code
                    );
                    this._saveSerieWithoutActorUpdate(serie);
                }
            });
        }

        // Add actor to series that don't already include it
        actor.series.forEach((serieCode) => {
            const serie = this.getSerieByCode(serieCode);
            if (serie && !serie.actors.includes(actor.code)) {
                serie.actors.push(actor.code);
                this._saveSerieWithoutActorUpdate(serie);
            }
        });

        // Save the actor itself
        const actorIndex = actors.findIndex((a) => a.code === actor.code);
        if (actorIndex >= 0) {
            actors[actorIndex] = actor;
        } else {
            actors.push(actor);
        }

        localStorage.setItem(this.ACTORS_KEY, JSON.stringify(actors));
    }

    /**
     * Get all actors from localStorage
     */
    public static getAllActors(): ActorModel[] {
        const actorsJson = localStorage.getItem(this.ACTORS_KEY);
        if (!actorsJson) {
            return [];
        }

        const actorsData = JSON.parse(actorsJson);
        return actorsData.map(ActorModel.fromJSON);
    }

    /**
     * Get an actor by code
     */
    public static getActorByCode(code: string): ActorModel | null {
        const actors = this.getAllActors();
        const actor = actors.find((a) => a.code === code);
        return actor || null;
    }

    /**
     * Update an existing actor
     */
    public static updateActor(actor: ActorModel): boolean {
        const actors = this.getAllActors();
        const index = actors.findIndex((a) => a.code === actor.code);

        if (index === -1) {
            return false;
        }

        // Use saveActor to handle series relationships
        this.saveActor(actor);
        return true;
    }

    /**
     * Delete an actor by code
     */
    public static deleteActor(code: string): boolean {
        const actors = this.getAllActors();
        const actor = actors.find((a) => a.code === code);

        if (!actor) {
            return false;
        }

        // Remove actor from all series it was in
        actor.series.forEach((serieCode) => {
            const serie = this.getSerieByCode(serieCode);
            if (serie) {
                serie.actors = serie.actors.filter(
                    (actorCode) => actorCode !== code
                );
                this._saveSerieWithoutActorUpdate(serie);
            }
        });

        // Remove actor from the list
        const filteredActors = actors.filter((a) => a.code !== code);
        localStorage.setItem(this.ACTORS_KEY, JSON.stringify(filteredActors));

        return true;
    }

    // SERIE METHODS

    /**
     * Save a serie to localStorage and update related actors
     */
    public static saveSerie(serie: SerieModel): void {
        const series = this.getAllSeries();
        const existingSerie = series.find((s) => s.code === serie.code);
        const isNew = !existingSerie;

        // If updating an existing serie, we need to handle removed actor relationships
        if (!isNew && existingSerie) {
            // Find actors that were removed from the serie
            const removedActors = existingSerie.actors.filter(
                (actorCode) => !serie.actors.includes(actorCode)
            );

            // Remove serie from those actors
            removedActors.forEach((actorCode) => {
                const actor = this.getActorByCode(actorCode);
                if (actor) {
                    actor.series = actor.series.filter(
                        (serieCode) => serieCode !== serie.code
                    );
                    this._saveActorWithoutSerieUpdate(actor);
                }
            });
        }

        // Add serie to actors that don't already include it
        serie.actors.forEach((actorCode) => {
            const actor = this.getActorByCode(actorCode);
            if (actor && !actor.series.includes(serie.code)) {
                actor.series.push(serie.code);
                this._saveActorWithoutSerieUpdate(actor);
            }
        });

        // Save the serie itself
        const serieIndex = series.findIndex((s) => s.code === serie.code);
        if (serieIndex >= 0) {
            series[serieIndex] = serie;
        } else {
            series.push(serie);
        }

        localStorage.setItem(this.SERIES_KEY, JSON.stringify(series));
    }

    /**
     * Get all series from localStorage
     */
    public static getAllSeries(): SerieModel[] {
        const seriesJson = localStorage.getItem(this.SERIES_KEY);
        if (!seriesJson) {
            return [];
        }

        const seriesData = JSON.parse(seriesJson);
        return seriesData.map(SerieModel.fromJSON);
    }

    /**
     * Get a serie by code
     */
    public static getSerieByCode(code: string): SerieModel | null {
        const series = this.getAllSeries();
        const serie = series.find((s) => s.code === code);
        return serie || null;
    }

    /**
     * Update an existing serie
     */
    public static updateSerie(serie: SerieModel): boolean {
        const series = this.getAllSeries();
        const index = series.findIndex((s) => s.code === serie.code);

        if (index === -1) {
            return false;
        }

        // Use saveSerie to handle actor relationships
        this.saveSerie(serie);
        return true;
    }

    /**
     * Delete a serie by code
     */
    public static deleteSerie(code: string): boolean {
        const series = this.getAllSeries();
        const serie = series.find((s) => s.code === code);

        if (!serie) {
            return false;
        }

        // Remove serie from all actors it contained
        serie.actors.forEach((actorCode) => {
            const actor = this.getActorByCode(actorCode);
            if (actor) {
                actor.series = actor.series.filter(
                    (serieCode) => serieCode !== code
                );
                this._saveActorWithoutSerieUpdate(actor);
            }
        });

        // Remove serie from the list
        const filteredSeries = series.filter((s) => s.code !== code);
        localStorage.setItem(this.SERIES_KEY, JSON.stringify(filteredSeries));

        return true;
    }

    // UTILITY METHODS

    /**
     * Clear all data from localStorage
     */
    public static clearAll(): void {
        localStorage.removeItem(this.ACTORS_KEY);
        localStorage.removeItem(this.SERIES_KEY);
    }

    /**
     * Get series by actor code
     */
    public static getSeriesByActorCode(actorCode: string): SerieModel[] {
        return this.getAllSeries().filter((serie) =>
            serie.actors.includes(actorCode)
        );
    }

    /**
     * Get actors by serie code
     */
    public static getActorsBySerieCode(serieCode: string): ActorModel[] {
        return this.getAllActors().filter((actor) =>
            actor.series.includes(serieCode)
        );
    }

    /**
     * Check if init data is loaded
     */
    public static isInitDataLoaded(): boolean {
        const isInitialized = localStorage.getItem(this.APP_INITIALIZED_KEY);

        return isInitialized === 'true';
    }

    /**
     * Load init data
     */
    public static loadInitData(): void {
        if (this.isInitDataLoaded()) {
            return;
        }

        const actors =
            '[{"code":"A1745421449023","name":"Bryan Cranston","urlIMDB":"https://www.imdb.com/name/nm0186505/","urlImage":"https://m.media-amazon.com/images/M/MV5BMTA2NjEyMTY4MTVeQTJeQWpwZ15BbWU3MDQ5NDAzNDc@._V1_.jpg","birthDate":"1956-04-23T00:00:00.000Z","placeOfBirth":"Los angeles","series":["S1745421172317"]},{"code":"A1745421816753","name":"Pedro Pascal","urlIMDB":"https://www.imdb.com/name/nm0050959/","urlImage":"https://m.media-amazon.com/images/M/MV5BYmQ5MjVmZTEtM2NkOC00N2I3LTkxNDgtY2YwNmQ1YWJiMTlhXkEyXkFqcGc@._V1_.jpg","birthDate":"1975-04-23T00:00:00.000Z","placeOfBirth":"Santiago de chile","series":["S1745424446218","S1745424760692"]},{"code":"A1745422167564","name":"Millie Bobby Brown","urlIMDB":"https://www.imdb.com/name/nm5611121","urlImage":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzAKasDfRWjuv-UypwF97j6SRwVV_iHcgD5QsidmUHcbp8d1WVq_lsbF3-OyDdlssi9xHqmBjy2V8GID4ejZ3yOA","birthDate":"2025-04-23T15:25:34.004Z","placeOfBirth":"Marbella","series":["S1745424603685"]},{"code":"A1745423345620","name":"Emilia Clarke","urlIMDB":"https://www.imdb.com/name/nm3592338","urlImage":"https://www.lavanguardia.com/peliculas-series/images/profile/1986/10/w300/86jeYFV40KctQMDQIWhJ5oviNGj.jpg","birthDate":"1986-04-23T00:00:00.000Z","placeOfBirth":"Londres","series":["S1745424673648"]},{"code":"A1745423473973","name":"Steve Carell","urlIMDB":"https://www.imdb.com/name/nm0136797","urlImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtNVGwMjhXQ990UH2Uik9UDL7D_Cbk3hJzC3i2vsbXuklsQHCGr0yVecYLWqLZL6zR7fpXcd1DLldrlweyyXpk1PtxciaFxos22UDIg","birthDate":"1962-04-23T00:00:00.000Z","placeOfBirth":"Concord","series":["S1745424840510"]},{"code":"A1745423616903","name":"Claire Foy","urlIMDB":"https://www.imdb.com/name/nm2946516","urlImage":"https://media.revistavanityfair.es/photos/60e8481bb90e169b9273865f/master/w_3940%2Cc_limit/135197.jpg","birthDate":"1984-03-23T00:00:00.000Z","placeOfBirth":"Stockport","series":["S1745424922031"]},{"code":"A1745423780706","name":"Cillian Murphy","urlIMDB":"https://www.imdb.com/name/nm0614165","urlImage":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Cillian_Murphy_at_Berlinale_2024%2C_Ausschnitt.jpg/1200px-Cillian_Murphy_at_Berlinale_2024%2C_Ausschnitt.jpg","birthDate":"1976-04-23T00:00:00.000Z","placeOfBirth":"Cork","series":["S1745425268034"]},{"code":"A1745423925937","name":"Henry Cavill","urlIMDB":"https://www.imdb.com/name/nm0147147","urlImage":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Henry_Cavill_at_the_2009_Tribeca_Film_Festival.jpg/250px-Henry_Cavill_at_the_2009_Tribeca_Film_Festival.jpg","birthDate":"1983-04-23T00:00:00.000Z","placeOfBirth":"Saint Helier","series":["S1745425338258"]},{"code":"A1745424060805","name":"Zendaya","urlIMDB":"https://www.imdb.com/name/nm3918035","urlImage":"https://m.media-amazon.com/images/M/MV5BNmZhZmNlZjUtM2M4Mi00ZDlmLTg2OWEtZGFhN2EwMDI3ZGI1XkEyXkFqcGc@._V1_FMjpg_UX2160_.jpg","birthDate":"1996-04-23T00:00:00.000Z","placeOfBirth":"Oakland","series":["S1745425392444"]},{"code":"A1745424318652","name":"Bella Ramsey","urlIMDB":"https://www.imdb.com/name/nm8165602","urlImage":"https://m.media-amazon.com/images/M/MV5BNGY3YTk0MDItNDk0Zi00NDAzLTk1NjYtMzM4NTNlNjhhMmM1XkEyXkFqcGc@._V1_.jpg","birthDate":"2003-04-23T00:00:00.000Z","placeOfBirth":"Nottingham","series":["S1745424446218"]}]';
        const series =
            '[{"code":"S1745421172317","name":"Breaking Bad","urlIMDB":"https://www.imdb.com/title/tt0903747/","urlImage":"https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_.jpg","releaseDate":"2008-04-23T00:00:00.000Z","endDate":"2013-04-23T00:00:00.000Z","actors":["A1745421449023"]},{"code":"S1745424446218","name":"The Last of Us","urlIMDB":"https://www.imdb.com/title/tt3581920","urlImage":"https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_.jpg","releaseDate":"2023-04-23T00:00:00.000Z","endDate":"2025-04-23T16:06:19.425Z","actors":["A1745421816753","A1745424318652"]},{"code":"S1745424603685","name":"Stranger Things","urlIMDB":"https://www.imdb.com/title/tt4574334","urlImage":"https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg","releaseDate":"2016-04-23T00:00:00.000Z","endDate":"2025-04-23T16:08:41.644Z","actors":["A1745422167564"]},{"code":"S1745424673648","name":"Game of Thrones","urlIMDB":"https://www.imdb.com/title/tt0944947","urlImage":"https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_.jpg","releaseDate":"2011-04-23T00:00:00.000Z","endDate":"2019-04-23T00:00:00.000Z","actors":["A1745423345620"]},{"code":"S1745424760692","name":"The Mandalorian","urlIMDB":"https://www.imdb.com/title/tt8111088","urlImage":"https://m.media-amazon.com/images/M/MV5BNjgxZGM0OWUtZGY1MS00MWRmLTk2N2ItYjQyZTI1OThlZDliXkEyXkFqcGc@._V1_.jpg","releaseDate":"2019-04-23T00:00:00.000Z","endDate":"2025-04-23T16:12:15.811Z","actors":["A1745421816753"]},{"code":"S1745424840510","name":"The Office","urlIMDB":"https://www.imdb.com/title/tt0386676","urlImage":"https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_.jpg","releaseDate":"2005-04-23T00:00:00.000Z","endDate":"2013-04-23T00:00:00.000Z","actors":["A1745423473973"]},{"code":"S1745424922031","name":"The Crown","urlIMDB":"https://www.imdb.com/title/tt4786824","urlImage":"https://m.media-amazon.com/images/M/MV5BODcyODZlZDMtZGE0Ni00NjBhLWJlYTAtZDdlNWY3MzkwMGVhXkEyXkFqcGc@._V1_.jpg","releaseDate":"2016-04-23T00:00:00.000Z","endDate":"2023-04-23T00:00:00.000Z","actors":["A1745423616903"]},{"code":"S1745425268034","name":"Peaky Blinders","urlIMDB":"https://www.imdb.com/title/tt2442560","urlImage":"https://m.media-amazon.com/images/M/MV5BOGM0NGY3ZmItOGE2ZC00OWIxLTk0N2EtZWY4Yzg3ZDlhNGI3XkEyXkFqcGc@._V1_.jpg","releaseDate":"2013-04-23T00:00:00.000Z","endDate":"2022-04-23T00:00:00.000Z","actors":["A1745423780706"]},{"code":"S1745425338258","name":"The Witcher","urlIMDB":"https://www.imdb.com/title/tt5180504","urlImage":"https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_.jpg","releaseDate":"2019-04-23T00:00:00.000Z","endDate":"2025-04-23T16:21:43.448Z","actors":["A1745423925937"]},{"code":"S1745425392444","name":"Euphoria","urlIMDB":"https://www.imdb.com/title/tt8772296","urlImage":"https://m.media-amazon.com/images/M/MV5BZjVlN2M2N2MtOWViZC00MzIxLTlhZWEtMTIwNDIwMzE3ZWJiXkEyXkFqcGc@._V1_.jpg","releaseDate":"2019-04-23T00:00:00.000Z","endDate":"2025-04-23T16:22:41.205Z","actors":["A1745424060805"]}]';

        localStorage.setItem(this.ACTORS_KEY, actors);
        localStorage.setItem(this.SERIES_KEY, series);
        localStorage.setItem(this.APP_INITIALIZED_KEY, 'true');
    }

    // PRIVATE HELPER METHODS

    /**
     * Save actor without updating series references
     * Used internally to avoid infinite recursion
     */
    private static _saveActorWithoutSerieUpdate(actor: ActorModel): void {
        const actors = this.getAllActors();
        const actorIndex = actors.findIndex((a) => a.code === actor.code);

        if (actorIndex >= 0) {
            actors[actorIndex] = actor;
        } else {
            actors.push(actor);
        }

        localStorage.setItem(this.ACTORS_KEY, JSON.stringify(actors));
    }

    /**
     * Save serie without updating actor references
     * Used internally to avoid infinite recursion
     */
    private static _saveSerieWithoutActorUpdate(serie: SerieModel): void {
        const series = this.getAllSeries();
        const serieIndex = series.findIndex((s) => s.code === serie.code);

        if (serieIndex >= 0) {
            series[serieIndex] = serie;
        } else {
            series.push(serie);
        }

        localStorage.setItem(this.SERIES_KEY, JSON.stringify(series));
    }
}
