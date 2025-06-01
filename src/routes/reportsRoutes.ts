import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyUser } from "../middlewares/verifyUser";
import { allowToProcess } from "../middlewares/allowToProcess";
import { reportValidation, updateReportValidation } from "../utils/validators/reportValidation";
import { errorValidation } from "../utils/validators/errorValidation";
import { createReport, deleteReport, getReport, getReports, sendMessageReport, updateReport } from "../controllers/reportControllers";

export const reportsRouter = express.Router();

reportsRouter.route("/")
.get(verifyToken,verifyUser,allowToProcess('admin'),getReports)
.post(verifyToken,verifyUser,reportValidation,errorValidation,createReport)

reportsRouter.route("/:id")
.get(verifyToken,verifyUser,allowToProcess('admin'),getReport)
.put(verifyToken,
    verifyUser,
    allowToProcess('admin'),
    updateReportValidation,
    errorValidation,
    updateReport
)
.delete(verifyToken,verifyUser,allowToProcess('admin'),deleteReport)

reportsRouter.post("/sendMessage/:id",verifyToken,verifyUser,allowToProcess('admin'),sendMessageReport)