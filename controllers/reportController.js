import { Report, ReportParameter, User } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import { Op } from 'sequelize'

export const createReport = async (req, res) => {
    const { title, description, reportType, parameters } = req.body
    const userId = req.user.userId

    try {
        const report = await Report.create({
            Title: title,
            Description: description,
            GeneratedBy: userId,
            ReportType: reportType
        })

        if (parameters && parameters.length > 0) {
            await ReportParameter.bulkCreate(
                parameters.map(param => ({
                    ReportID: report.ReportID,
                    ParameterName: param.name,
                    ParameterValue: param.value
                }))
            )
        }

        const createdReport = await Report.findByPk(report.ReportID, {
            include: [{
                model: ReportParameter,
                attributes: ['ParameterName', 'ParameterValue']
            }]
        })

        res.status(201).json({
            message: 'Report created successfully',
            report: createdReport
        })
    } catch (error) {
        handleError(res, 'Error creating report', error)
    }
}

export const getReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: ReportParameter,
                    attributes: ['ParameterName', 'ParameterValue']
                },
                {
                    model: User,
                    attributes: ['Username']
                }
            ],
            order: [['GeneratedAt', 'DESC']]
        })
        res.status(200).json(reports)
    } catch (error) {
        handleError(res, 'Error retrieving reports', error)
    }
}

export const getReportById = async (req, res) => {
    const { reportId } = req.params

    try {
        const report = await Report.findByPk(reportId, {
            include: [{
                model: ReportParameter,
                attributes: ['ParameterName', 'ParameterValue']
            }]
        })

        if (!report) {
            return res.status(404).json({ message: 'Report not found' })
        }

        res.status(200).json(report)
    } catch (error) {
        handleError(res, 'Error retrieving report', error)
    }
}

export const deleteReport = async (req, res) => {
    const { reportId } = req.params

    try {
        const report = await Report.findByPk(reportId)
        if (!report) {
            return res.status(404).json({ message: 'Report not found' })
        }

        await report.destroy()
        res.status(200).json({ message: 'Report deleted successfully' })
    } catch (error) {
        handleError(res, 'Error deleting report', error)
    }
}