import { IdentifyResponse } from "../interfaces/response.ts";

export const generateResponseObj = (
  primaryContactId: number | undefined,
  emails: (string | undefined)[],
  phoneNumbers: (string | undefined)[],
  secondaryContactIds: (number | null)[]
) => {
  const responseObj: IdentifyResponse = {
    contact: {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  };

  return responseObj;
};
