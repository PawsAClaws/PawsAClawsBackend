import Notification from "../models/notificationModel";

export const sendNotification = async(message:string,userId:number)=>{
    try {
        const notification = await Notification.create({
            message,
            userId,
        });
        await notification.save();
    } catch(err:any){
        console.log(err);
    }
}