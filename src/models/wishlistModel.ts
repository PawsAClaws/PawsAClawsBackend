import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Post from "./postsModel";
import User from "./usersModel";

interface wishlistItem {
    id?: number;
    postId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Wishlist extends Model<wishlistItem> implements wishlistItem {
    public readonly id!: number;
    public postId!: number;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Wishlist.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
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
    },
},{
    sequelize: sequelize,
    tableName: "wishlist",
    timestamps: true,
})

Wishlist.belongsTo(Post, { foreignKey: "postId",as: "post" });
Wishlist.belongsTo(User, { foreignKey: "userId",as: "user" });
Post.hasMany(Wishlist, { foreignKey: "postId",as: "wishlist" });
User.hasMany(Wishlist, { foreignKey: "userId",as: "wishlist" });

export default Wishlist;