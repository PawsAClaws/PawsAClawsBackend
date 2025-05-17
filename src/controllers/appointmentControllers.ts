import { Request, Response } from "express";
import Appointment from "../models/appointmentsModel";
import Doctor from "../models/doctorModel";
import { pagination } from "../middlewares/pagination";
import User from "../models/usersModel";
import { sendNotification } from "../helpers/sendNotification";
import { sendEmail } from "../utils/sendEmail";

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findOne({
            where: {
                id: req.body.doctorId,
                active: true
            },
        });
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
                        status: "accepted",
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
        const {count,rows} = await Appointment.findAndCountAll({
            where: {
                userId: (req as any).user.id,
            },
            include: [{model: Doctor,as:"doctor"}],
            limit: +limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
        });
        const pagin = pagination(+limit,+page,count);
        const data = {
            appointments: rows,
            pagination: pagin
        };
        res.status(200).json({
            status: "success",
            data: data,
        });
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
        const {count,rows} = await Appointment.findAndCountAll({
            where: {
                doctorId: req.params.id,
            },
            include: [{model: User,attributes:{exclude:["password"]},as:"user"}],
            limit: +limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        });
        const pagin = pagination(+limit,+page,count);
        const data = {
            appointments: rows,
            pagination: pagin
        };
        res.status(200).json({
            status: "success",
            data: data,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id
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
            const doctor = await Doctor.findByPk(appointment.doctorId)
            let message = ""
            let subject = ""
            if(appointment.status === "accepted" && userId !== appointment.userId){
                message = `<p>Hi ${user?.firstName}, </p>
                    <p>Great news! Your reservation request with Dr. ${doctor?.realName} has been accepted. 🐾 </p>
                    <p>📅 Appointment Details: </p>
                        <p>•	Date : ${appointment.time} </p>
                        <p>•	Doctor: Dr. ${doctor?.realName} </p>
                        <p>•	Case Description: “${appointment.description}” </p>
                    <p>Please make sure to arrive a few minutes early and bring any relevant pet information or records. </p>
                    <p>If you need to reschedule, you can do so from your profile in the app. </p>
                    <p>Looking forward to seeing you and your furry friend soon! 🐶🐱 </p>
                    <p>— The Paws&Claws Support Team`;
                subject = " 🎉 Your Pet Appointment is Confirmed!"
            }
            else if(appointment.status === "cancelled" && userId !== appointment.userId){
                message=`<p>Hi ${user?.firstName},</p>
                    <p>We’re sorry to let you know that your recent reservation request with Dr. ${doctor?.realName} has been cancelled.</p>
                    <p>This could be due to scheduling conflicts or availability issues.</p>
                    <p>📝 Request Details:</p>
                        <p>•Date Requested: ${appointment.time} </p>
                    <p>•Case Description: ${appointment.description} </p>
                    <p>You can try booking a different time or choose another available doctor from the app. </p>
                    <p>We’re here to help make sure your pet gets the care they need. 💙</p>
                    — The Paws&Claws Support Team`
                subject = "😢 Your Reservation Request Couldn’t Be Accepted"
            }
            else if(appointment.userId === userId){
                message = `<p>Hi ${user?.firstName}</p>,
                    <p>We would like to confirm that your appointment with Dr. ${doctor?.realName}, originally scheduled for ${appointment.time}, has been successfully cancelled.</p>
                    <p>If this was a mistake or you wish to reschedule, please feel free to book a new appointment at your convenience.</p>
                    <p>Thank you for using our service.</p>
                    <p>We hope to assist you again soon.</p>
                    <p>Best regards</p>,
                    <p>The Paws&Claws Support Team</p>
                `
                subject = "Appointment Cancellation Confirmation"
            }
            await sendEmail(user?.email as string,message,user?.firstName as string,subject);
            await sendNotification("Your Pet Appointment is Updated!",appointment.userId);
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