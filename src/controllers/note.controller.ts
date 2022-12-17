import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/Controller.interface";
import NoteService from "../services/note.service";
import { CreateNoteBody } from "../validators/note.validation";
import VerifiedToken from "../interfaces/VerifiedToken.interface";
import { requireTokenMiddleware } from "../middleware/requireToken.middleware";

class NoteController implements Controller {
    public router: Router = Router();
    public path: string = "/notes";
    private service: NoteService = new NoteService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        /**
         * @route GET /api/notes
         */
        this.router.get(this.path, requireTokenMiddleware, this.findAll);

        /**
         * @route POST /api/notes
         */
        this.router.post(this.path, requireTokenMiddleware, this.create);
    };

    private findAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notes = await this.service.findAll();
            res.status(200).json(notes);
        } catch (e) {
            next(e);
        }
    };

    private create = async (
        req: Request<{}, {}, CreateNoteBody>,
        res: Response,
        next: NextFunction
    ) => {
        const token: VerifiedToken = res.locals.token;
        try {
            const note = await this.service.create({
                ...req.body,
                userId: token.userId,
            });
            res.status(201).json(note);
        } catch (e) {
            next(e);
        }
    };
}

export default NoteController;
