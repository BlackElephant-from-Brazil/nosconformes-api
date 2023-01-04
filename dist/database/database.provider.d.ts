export declare const databaseProviders: {
    provide: string;
    useFactory: () => Promise<import("typeorm").DataSource>;
}[];
