export interface Company {
    _eq: string;
    logo: string;
    name: string;
    cnpj: string;
    site: string;
}
export interface Manager {
    _eq: string;
    name: string;
    office: string;
    department: string;
    email: string;
    phone: string;
}
export interface IQuery {
    company(_eq: string): Nullable<Company> | Promise<Nullable<Company>>;
}
declare type Nullable<T> = T | null;
export {};
