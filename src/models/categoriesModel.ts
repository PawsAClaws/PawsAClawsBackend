import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

interface categoryAttributes {
    id?: number;
    name: string;
    description: string;
    photo: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Category extends Model<categoryAttributes> {
    public readonly id!: number;
    public name!: string;
    public description!: string;
    public photo!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: sequelize,
    tableName: 'categories',
    timestamps: true,
});

export default Category;