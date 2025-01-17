export default interface RepositoryInterface<T> {
    create(entity: T): Promise<void>; //Trabalhar de forma async
    update(entity: T): Promise<void>;
    find(id: string): Promise<T>;
    findAll(): Promise<T[]>;
}