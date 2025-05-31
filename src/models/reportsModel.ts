import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./usersModel";

interface ReportsModel {
    id?: string;
    reason: string;
    description: string;
    status?: 'pending' | 'resolved' | 'rejected';
    reporterId: number;
    reportedId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Reports extends Model<ReportsModel> implements ReportsModel {
    public readonly id!: string;
    public reason!: string;
    public description!: string;
    public status!: 'pending' | 'resolved' | 'rejected';
    public reporterId!: number;
    public reportedId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Reports.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved', 'rejected'),
        defaultValue: 'pending',
    },
    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    reportedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: sequelize,
    tableName: 'reports',
    timestamps: true,
});

Reports.belongsTo(User, { foreignKey: 'reporterId' , as: 'reporter' });
Reports.belongsTo(User, { foreignKey: 'reportedId' , as: 'reported' });

User.hasMany(Reports, { foreignKey: 'reporterId', as: 'reporters' });
User.hasMany(Reports, { foreignKey: 'reportedId', as: 'reported' });

export default Reports;