export class ActorModel {
    constructor(
        public code: string,
        public name: string,
        public urlIMDB: string,
        public urlImage: string,
        public birthDate: Date,
        public placeOfBirth: string,
        public series: string[]
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromJSON(json: any): ActorModel {
        return new ActorModel(
            json.code,
            json.name,
            json.urlIMDB,
            json.urlImage,
            new Date(json.birthDate),
            json.placeOfBirth,
            json.series
        );
    }
}
