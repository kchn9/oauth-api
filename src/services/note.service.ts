import { PrismaClient, Note } from "@prisma/client";

class NoteService {
    private dbClient: PrismaClient = new PrismaClient();

    public findAll = async (): Promise<Note[]> => {
        try {
            const notes = await this.dbClient.note.findMany();
            return notes;
        } catch (e) {
            throw e;
        }
    };

    public create = async (
        body: Omit<Note, "id" | "createdAt" | "updatedAt">
    ): Promise<Note> => {
        try {
            const note = await this.dbClient.note.create({
                data: body,
            });
            return note;
        } catch (e) {
            throw e;
        }
    };
}

export default NoteService;
