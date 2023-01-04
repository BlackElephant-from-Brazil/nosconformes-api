export declare class Company {
    __typename?: 'Company';
    _eq: string;
    logo: string;
    name: string;
    cnpj: string;
    site: string;
}
export declare class Manager {
    __typename?: 'Manager';
    _eq: string;
    name: string;
    office: string;
    department: string;
    email: string;
    phone: string;
}
export declare abstract class IQuery {
    __typename?: 'IQuery';
    abstract company(_eq: string): Nullable<Company> | Promise<Nullable<Company>>;
}
declare type Nullable<T> = T | null;
export {};
