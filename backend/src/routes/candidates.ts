import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { CandidateStatus } from "@prisma/client";

const router = Router();

const parseId = (value: string) => {
    const id = Number(value);
    return Number.isFinite(id) ? id : null;
}

//GET /candidates
router.get("/", async (req, res, next) => {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                skills: {include: { skill: true } },
            },
        });

        const result = candidates.map(cn => ({
            id: cn.id,
            name: cn.name,
            position: cn.position,
            status: cn.status,
            email: cn.email,
            phone: cn.phone,
            description: cn.description,
            createdAt: cn.createdAt,
            skills: cn.skills.map(cs => cs.skill),
        }));

        res.status(200).json(result)
    } catch (e) {
        next(e);
    }
});

//GET /:id
router.get("/:id", async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const condidate = await prisma.candidate.findUnique({
            where: { id }, 
            include: {skills: { include: {skill: true}},},
        });
        if (!condidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({
            ...condidate,
            skills: condidate.skills.map((cs) => cs.skill),
        });

    } catch (e) {
        next(e);
    }
});

const patchStatusSchema = z.object({
    status: z.enum(["active", "interview", "rejected"]),
});
//PATCH /:id/status
router.patch("/:id/status", async (req, res, next) => {
    try {
        const id = parseId(req.params.id);

        if (!id) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const parsed = patchStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ 
                message: "Invalid body",
                errors: parsed.error.issues 
            });
        }

        const existing = await prisma.candidate.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const update = await prisma.candidate.update({ 
            where: { id},
            data: {status: parsed.data.status as  CandidateStatus},
        });

        res.status(200).json(
            {id: update.id, status: update.status, updatedAt: update.updatedAt}
        );
        
    } catch (e) {
        next(e);
    }
})

export default router;