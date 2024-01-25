import Product from "../product/entity/product";
import RepositoryInterface from "./repository-interface";

export default interface ProductRepositoryInterface extends RepositoryInterface<Product> {
    // Gerenciamento especificas para o Produto.
}