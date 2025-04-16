import { Request, Response } from "express";
import Doctor from "../models/doctorModel";
import { redisClient } from "../config/redisClient";
import { pagination } from "../middlewares/pagination";
import { col, Op, where } from "sequelize";
import User from "../models/usersModel";

export const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const location = req.query.location || "";
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (+page - 1) * +limit;
        const q = (req.query.q)?.toString() || "";
        const key = `${q}:${page}:${limit}:${location}`;
        const cache = await redisClient.get(key);
        if (cache) {
            // console.log("cache",JSON.parse(cache));
            res.status(200).json({
                status: "success",
                data: JSON.parse(cache),
            });
        }
        else{
            const {count,rows} = await Doctor.findAndCountAll({
                include:[{model:User,attributes:{exclude:["password"]},as:"user"}],
                where: {
                    [Op.or]: [
                        {
                            bio: {
                                [Op.like]: `%${q}%`,
                            },
                        },
                        {
                            address: {
                                [Op.like]: `%${q}%`,
                            },
                        },
                        where(col('user.firstName'), {
                            [Op.like]: `%${q}%`
                        }),
                        where(col('user.lastName'), {
                            [Op.like]: `%${q}%`
                        })
                    ],
                    [Op.and]: [
                        where(col('user.location'), {
                            [Op.like]: `%${location}%`
                        }),
                    ]
                },
                limit:+limit,
                offset:+offset,
            });
            const pagin = pagination(+limit,+page,count);
            await redisClient.set(key,JSON.stringify({
                doctors:rows,
                pagination: pagin
            }),{EX:180});
            res.status(200).json({
                status: "success",
                data: {
                    doctors:rows,
                    pagination: pagin
                },
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getDoctorUser = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findOne({
            where: {
                userId: (req as any).user.id
            }
        });
        if (!doctor) {
            res.status(400).json({
                status: "bad request",
                message: "doctor not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: doctor,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ["password"],
                    },
                    as:"user"
                },
            ],
        });
        if (!doctor) {
            res.status(400).json({
                status: "bad request",
                message: "doctor not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: doctor,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const createDoctor = async (req: Request, res: Response) => {
    try {
        const getDocById = await Doctor.findOne({
            where: {
                userId: (req as any).user.id
            }
        });
        if (getDocById){
            res.status(400).json({
                status: "bad request",
                message: "doctor already exist",
            });
        }
        else{
            const { bio, address, price, experience, speciality, numOfReservat, daysWork, startTimeWork, endTimeWork } = req.body;
            const doctor = await Doctor.create({
                bio,
                address,
                price,
                experience,
                speciality,
                numOfReservat,
                daysWork,
                startTimeWork,
                endTimeWork,
                userId:(req as any).user.id
            });
            await doctor.save();
            res.status(201).json({
                status: "success",
                data: doctor,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateDoctor = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) {
            res.status(400).json({
                status: "bad request",
                message: "doctor not found",
            });
        } else {
            await doctor.update(req.body);
            await doctor.save();
            res.status(200).json({
                status: "success",
                data: doctor,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const deleteDoctor = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) {
            res.status(400).json({
                status: "bad request",
                message: "doctor not found",
            });
        } else {
            await doctor.destroy();
            await doctor.save();
            res.status(200).json({
                status: "success",
                message: "doctor deleted successfully",
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};