import { Sequelize } from "sequelize-typescript";
import CustomerModel from '../db/sequelize/model/customer.model';
import Customer from "../../domain/customer/entity/customer";
import CustomerRepository from "./customer.repository";
import Address from "../../domain/customer/value-object/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            host: "localhost",
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close(); // Async close
    });

    it("should create a new Customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer");
        const address = new Address("Street 1", 1 ,"Zipcode 1", "City 1"); // Objeto de Valor.
        customer.Address = address;

        await customerRepository.create(customer);

        // Retrieve the product in the database
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        // Convert to JSON e Verify is same Product 
        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should update a Customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer");
        const address = new Address("Street 1", 1 ,"Zipcode 1", "City 1"); // Objeto de Valor.
        customer.Address = address;

        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer); // Realiza o Update.
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should find a Customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer");
        const address = new Address("Street 1", 1 ,"Zipcode 1", "City 1"); // Objeto de Valor.
        customer.Address = address;
        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find("123");

        expect(customer).toStrictEqual(foundCustomer);
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();
        
        expect(async () => {
            await customerRepository.find("1234");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all products", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer");
        const address = new Address("Street 1", 1 ,"Zipcode 1", "City 1"); 
        customer.Address = address;
        customer.addRewardPoints(10);
        customer.isActive();
        
        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 2 ,"Zipcode 2", "City 2");// Objeto de Valor.
        customer2.Address = address2;
        customer2.addRewardPoints(20);

        await customerRepository.create(customer)
        await customerRepository.create(customer2);

        const foundAllCustomer = await customerRepository.findAll();
        
        expect(foundAllCustomer).toHaveLength(2); //Verificar o tamanho.
        expect(foundAllCustomer).toContainEqual(customer);
        expect(foundAllCustomer).toContainEqual(customer2);
    });
});