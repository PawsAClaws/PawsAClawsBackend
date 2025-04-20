import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL as string,
        pass: process.env.PASS as string,
    },
});

export const sendEmail = async(email:string,message:string,username:string,subject:string)=>{
    const option = {
        from: process.env.USER as string,
        to:email,
        subject,
        html:
        `<div>
            <h1>Hello ${username}</h1>
            <p>${message}</p>
        </div>`
        ,
    }

    return await transport.sendMail(option)
}