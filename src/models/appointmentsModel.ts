import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Doctor from "./doctorModel";
import User from "./usersModel";

interface appointmentTypes{
    id?: number,
    time: Date,
    status: string,
    doctorId: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date,
}

class Appointment extends Model<appointmentTypes>{
    public readonly id!: number;
    public time!: Date;
    public status!: string;
    public doctorId!: number;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Appointment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    time: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "accepted", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
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
},{
    sequelize: sequelize,
    tableName: 'appointments',
    timestamps: true,
})

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });

export default Appointment;