import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./usersModel";

interface notificationType {
    id?: number;
    message: string;
    isReead?: boolean;
    userId: number;
    createAt?: Date;
    updateAt?: Date;
}

class Notification extends Model<notificationType> implements notificationType {
    public readonly id!: number;
    public message!: string;
    public isReead!: boolean;
    public userId!: number;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;
}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isReead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    },
},{
    sequelize: sequelize,
    tableName: "notifications",
    timestamps: true,
})

Notification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});
User.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
});

export default Notification;