import Product from "../../domain/product/entity/product";
import CustomerRepositoryInterface from '../../domain/customer/repository/customer-repository.interface';
import Customer from '../../domain/customer/entity/customer';
import CustomerModel from "../db/sequelize/model/customer.model";
import Address from '../../domain/customer/value-object/address';

/**
 * Realiza o desacoplamento do repositorio com a entidade.
 */
export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        
        //Os valores do Address estão vindo do Objeto de valor.
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.Address.street,
            number: entity.Address.number,
            zipcode: entity.Address.zip,
            city: entity.Address.city
        });
    }
    async update(entity: Customer): Promise<void> {
        // Valores do VO estão sendo acessados pelo entity.Address.xxx
        await CustomerModel.update({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.Address.street,
            number: entity.Address.number,
            zipcode: entity.Address.zip,
            city: entity.Address.city
        },
            {
                where: {
                    id: entity.id
                }
            });
    }
    async find(id: string): Promise<Customer> {
        let customerModel;
        
        try {
           customerModel = await CustomerModel.findOne({ where: { id: id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found"); //Caso não encontrar o customer.
        }

        const customer = new Customer(id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        )
        customer.changeAddress(address);
        return customer;
    }
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll(); //Recebe um modelo do banco de dados (Com os valores) Não o objeto de fato.

        //Recuperou todos os Customer, para cada um deles ele cria um novo objeto.
        const customers = customerModels.map(customerModel => {
            let customer = new Customer(customerModel.id, customerModel.name);
            customer.addRewardPoints(customerModel.rewardPoints);
            //Realiza a operação dos Agregados.
            const address = new Address(
                customerModel.street,
                customerModel.number,
                customerModel.zipcode,
                customerModel.city);
            customer.changeAddress(address);
            if (customerModel.active) {
                customer.activate();
            }
            return customer;
        });

        return customers;
    }
}