import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
    birthday: Date;
    phone: string;
    location: string;
    role?: 'user' | 'admin';
    photo?: string;
    verify?: boolean;
    blocked?: boolean;
    googleId?:string;
    createdAt?: Date;
    updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public readonly id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public gender!: 'male' | 'female';
    public birthday!: Date;
    public phone!: string;
    public location!: string;
    public role!: 'user' | 'admin';
    public photo!: string;
    public verify!: boolean;
    public blocked!: boolean;
    public googleId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gender:{
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },
    photo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    verify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true
});

export default User;