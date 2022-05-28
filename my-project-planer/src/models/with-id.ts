

export type Id = number;

export type WithId<T> = T & {
    id: Id;
}