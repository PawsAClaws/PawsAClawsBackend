import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./usersModel";

interface DoctorAttributes {
    id?: number;
    bio: string;
    address: string;
    price: number;
    experience: number;
    speciality: string;
    numOfReservat: number;
    daysWork: string[];
    startTimeWork: string;
    endTimeWork: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Doctor extends Model<DoctorAttributes> implements DoctorAttributes {
    public readonly id!: number;
    public bio!: string;
    public address!: string;
    public price!: number;
    public experience!: number;
    public speciality!: string;
    public numOfReservat!: number;
    public daysWork!: string[];
    public startTimeWork!: string;
    public endTimeWork!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Doctor.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    speciality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numOfReservat: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    daysWork: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        values: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    startTimeWork: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endTimeWork: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: sequelize,
    tableName: 'doctors',
    timestamps: true,
})

Doctor.belongsTo(User, {foreignKey: 'userId', as: 'user'});
User.hasOne(Doctor, {foreignKey: 'userId', as: 'doctors'});

export default Doctor;