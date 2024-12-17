//domain:user_dto.ts


/**
 * Represents the Data Transfer Object for a user.
 * This type is used to standardize the data exchanged between layers or services
 * when dealing with user-related operations.
 */

export type UserDTO = {
    id: string;
    name: string;
    email: string;
    password: string;
}