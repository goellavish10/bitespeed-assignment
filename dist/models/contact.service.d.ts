import { QueryResponse } from "../interfaces/response.ts";
export declare const contactExists: (email: string | null, phoneNumber: string | null) => Promise<boolean>;
export declare const createPrimaryContactEntry: (email: string, phoneNumber: string) => Promise<QueryResponse>;
