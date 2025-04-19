import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./usersModel";
import Doctor from "./doctorModel";

interface reviewsTypes{
    id?: number,
    rating: number,
    comment: string,
    userId: number,
    doctorId: number,
    createdAt?: Date,
    updatedAt?: Date,
}

class Review extends Model<reviewsTypes>{
    public readonly id!: number;
    public rating!: number;
    public comment!: string;
    public userId!: number;
    public doctorId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
},{
    sequelize: sequelize,
    tableName: 'reviews',
    timestamps: true,
})

Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Doctor.hasMany(Review, { foreignKey: 'doctorId', as: 'reviews' });

export default Review;