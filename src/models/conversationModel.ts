import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./usersModel";

interface conversationType {
    id?: number;
    senderId: number;
    receiverId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Conversation extends Model<conversationType> implements conversationType {
    public readonly id!: number;
    public senderId!: number;
    public receiverId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Conversation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize: sequelize,
        tableName: "conversations",
        timestamps: true,
    }
);

Conversation.belongsTo(User ,{foreignKey:"senderId",as:"sender"});
Conversation.belongsTo(User ,{foreignKey:"receiverId",as:"receiver"});
User.hasMany(Conversation,{foreignKey:"senderId",as:"sender"});
User.hasMany(Conversation,{foreignKey:"receiverId",as:"receiver"});

export default Conversation;