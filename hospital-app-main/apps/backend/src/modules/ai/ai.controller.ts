import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/app-error";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

export const chatWithAI = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { query, patient_id } = req.body;

        if (!query) {
            throw new AppError("Query is required", 400);
        }

        const response = await fetch(`${AI_SERVICE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, patient_id }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("AI Service Error:", errorText);
            throw new AppError("Failed to communicate with AI service", response.status);
        }

        const data = await response.json();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
