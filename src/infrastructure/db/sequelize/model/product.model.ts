import { Model } from "sequelize-typescript";
import { Column, PrimaryKey, Table } from "sequelize-typescript";

/**
 * Model representa a entidade no banco de dados.
 * 
 */
@Table({
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends Model {

    @PrimaryKey
    @Column
    declare id:string;

    @Column({
        allowNull: false,
    })
    declare name:string;

    @Column({
        allowNull: false,
    })
    declare price: number;
}