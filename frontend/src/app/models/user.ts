import { Local } from "./local";

export class User {
    id?: number;
    username?: string;
    password?: string;
    enabled?: boolean;
    localId?: number; // 🔥 este nombre debe coincidir con el del token: local_id
    roles:string[]=[];
}
