import { Request, Response } from "express";
import Appointment from "../models/appointmentsModel";
import Doctor from "../models/doctorModel";
import { redisClient } from "../config/redisClient";
import { pagination } from "../middlewares/pagination";
import User from "../models/usersModel";
import { sendNotification } from "../helpers/sendNotification";
import { sendEmail } from "../utils/sendEmail";

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findByPk(req.body.doctorId);
        if (!doctor) {
            res.status(400).json({
                status: "bad request",
                message: "doctor not found",
            });
        }
        else{
            const date = new Date(req.body.time);
            const day = `${date}`.split(" ")[0]
            // console.log(day);
            const isIncluded = doctor.daysWork.find((item) => item.includes(day));
            if(!isIncluded){
                res.status(400).json({
                    status: "bad request",
                    message: "doctor is not working on this day",
                });
            }
            else{
                const allAppointments = await Appointment.findAll({
                    where: {
                        doctorId: req.body.doctorId,
                        time: req.body.time,
                    },
                });
                if(allAppointments.length >= doctor.numOfReservat){
                    res.status(400).json({
                        status: "bad request",
                        message: "doctor is full for this time, please choose another time",
                    });
                }
                else{
                    const appointment = await Appointment.create({
                        ...req.body,
                        userId: (req as any).user.id,
                    });
                    res.status(201).json({
                        status: "success",
                        data: appointment,
                    });
                }
            }
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getAppointmentUser = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (+page - 1) * +limit;
        const key = `${offset}:${limit}:${page}:user`;
        const cach = await redisClient.get(key);
        if (cach) {
            res.status(200).json({
                status: "success",
                data: JSON.parse(cach),
            });
        } else {
            const {count,rows} = await Appointment.findAndCountAll({
                where: {
                    userId: (req as any).user.id,
                },
                include: [{model: Doctor,as:"doctor"}],
                limit: +limit,
                offset: offset,
            });
            const pagin = pagination(+limit,+page,count);
            const data = {
                appointments: rows,
                pagination: pagin
            };
            await redisClient.set(key, JSON.stringify(data),{
                EX:180
            });
            res.status(200).json({
                status: "success",
                data: data,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getAppointmentDoctor = async(req: Request, res: Response) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = (+page - 1) * +limit;
        const key = `${page}:${limit}:${offset}:doctor`;
        const cach = await redisClient.get(key);
        if (cach) {
            res.status(200).json({
                status: "success",
                data: JSON.parse(cach),
            });
        } else {
            const {count,rows} = await Appointment.findAndCountAll({
                where: {
                    doctorId: req.params.id,
                },
                include: [{model: User,attributes:{exclude:["password"]},as:"user"}],
                limit: +limit,
                offset: offset,
            });
            const pagin = pagination(+limit,+page,count);
            const data = {
                appointments: rows,
                pagination: pagin
            };
            await redisClient.set(key, JSON.stringify(data),{
                EX:180
            });
            res.status(200).json({
                status: "success",
                data: data,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            res.status(400).json({
                status: "bad request",
                message: "appointment not found",
            });
        } else {
            await appointment.update(req.body);
            await appointment.save();
            const user = await User.findByPk(appointment.userId);
            const message = `The Doctor ${appointment.status} your appointment`;
            await sendEmail(user?.email as string,message,user?.firstName as string,"appointment updated");
            await sendNotification(message,appointment.userId);
            res.status(200).json({
                status: "success",
                data: appointment,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};