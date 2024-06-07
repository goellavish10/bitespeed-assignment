export interface IdentifyResponse {
  contact: ContactResponseObject;
}

export interface ContactResponseObject {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
