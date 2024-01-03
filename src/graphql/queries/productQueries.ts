import { gql } from '@apollo/client';

export const GetProducts = gql`
    query Products($filter: FilterInput) {
        products(filter: $filter) {
            description
            id
            idCategory
            name
            price
        }
    }
`;