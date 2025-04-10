import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Category from "./categoriesModel";
import User from "./usersModel";

interface postsModel {
    id?: number;
    title: string;
    description: string;
    price: number;
    type:"sale" | 'adoption' | "shop";
    gender: "male" | "female";
    age: number;
    weight: number;
    country: string;
    city: string;
    photo: string;
    categoryId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Post extends Model<postsModel> implements postsModel {
    public readonly id!: number;
    public title!: string;
    public description!: string;
    public price!: number;
    public type!: "sale" | 'adoption' | "shop";
    public gender!: "male" | "female";
    public age!: number;
    public weight!: number;
    public country!: string;
    public city!: string;
    public photo!: string;
    public categoryId!: number;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Post.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("sale", "adoption", "shop"),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }
},{
    sequelize: sequelize,
    tableName: "posts",
    timestamps: true,
});

Post.belongsTo(Category, { foreignKey: "categoryId",as: "category" });
Post.belongsTo(User, { foreignKey: "userId",as: "user" });
Category.hasMany(Post, { foreignKey: "categoryId",as: "posts" });
User.hasMany(Post, { foreignKey: "userId",as: "posts" });

export default Post;