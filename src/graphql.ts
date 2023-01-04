
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

type Nullable<T> = T | null;
