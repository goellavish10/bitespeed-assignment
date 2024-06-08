import { IdentifyResponse } from "../interfaces/response.ts";
export declare const generateResponseObj: (primaryContactId: number | undefined, emails: (string | undefined)[], phoneNumbers: (string | undefined)[], secondaryContactIds: (number | null)[]) => IdentifyResponse;
