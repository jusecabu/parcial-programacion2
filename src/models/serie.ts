export class SerieModel {
    constructor(
        public code: string,
        public name: string,
        public urlIMDB: string,
        public urlImage: string,
        public releaseDate: Date,
        public endDate: Date,
        public actors: string[]
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromJSON(json: any): SerieModel {
        return new SerieModel(
            json.code,
            json.name,
            json.urlIMDB,
            json.urlImage,
            new Date(json.releaseDate),
            new Date(json.endDate),
            json.actors
        );
    }
}
