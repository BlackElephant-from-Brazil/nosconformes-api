
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Company {
    __typename?: 'Company';
    _eq: string;
    logo: string;
    name: string;
    cnpj: string;
    site: string;
}

export class Manager {
    __typename?: 'Manager';
    _eq: string;
    name: string;
    office: string;
    department: string;
    email: string;
    phone: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract company(_eq: string): Nullable<Company> | Promise<Nullable<Company>>;
}

type Nullable<T> = T | null;
