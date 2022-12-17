import { object, string, TypeOf } from "zod";

export const create = object({
    body: object({
        title: string().min(6, "Title should be at least 6 chars long"),
        content: string().min(12, "Note should be at least 12 chars long"),
    }),
});

export type CreateNoteBody = TypeOf<typeof create>["body"];
