import { Sequelize } from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import Product from "../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            host: "localhost",
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close(); // Async close
    });

    it("should create a new Product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product", 100);

        await productRepository.create(product);

        // Retrieve the product in the database
        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        // Convert to JSON e Verify is same Product 
        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product",
            price: 100
        });
    });

    it("should update a Product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product", 100);
        await productRepository.create(product);

        product.changeName("Product 2");
        product.changePrice(200);

        await productRepository.update(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });
        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 200
        });
    });

    it("should find a Product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product", 100);
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });
        const foundProduct = await productRepository.find("1");

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price
        });
    });

    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product", 100);
        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product);
        await productRepository.create(product2);

        const foundAllProducts = await productRepository.findAll();
        const products = [product, product2];
        
        expect(foundAllProducts).toEqual(products);
    });
});