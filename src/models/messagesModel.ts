import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Conversation from "./conversationModel";
import User from "./usersModel";

interface messagesType {
    id?: number;
    message?: string;
    media?: string;
    seen?: boolean;
    sendBy: number;
    conversationId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Message extends Model<messagesType> implements messagesType {
    public readonly id!: number;
    public message!: string;
    public media!: string;
    public sendBy!: number;
    public conversationId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    media: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    sendBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Conversation,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }
},{
    sequelize: sequelize,
    tableName: "messages",
    timestamps: true,
})

Message.belongsTo(Conversation,{
    foreignKey: "conversationId",
    as: "conversation",
});
Message.belongsTo(User,{
    foreignKey: "sendBy",
    as: "send",
});
Conversation.hasMany(Message,{
    foreignKey: "conversationId",
    as: "messages",
});
User.hasMany(Message,{
    foreignKey: "sendBy",
    as: "send",
});
export default Message;