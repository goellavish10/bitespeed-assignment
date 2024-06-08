export interface IdentifyResponse {
  contact: ContactResponseObject;
}

export interface ContactResponseObject {
  primaryContactId: number | undefined;
  emails: (string | undefined)[];
  phoneNumbers: (string | undefined)[];
  secondaryContactIds: (number | null)[];
}

export interface QueryResponse {
  primaryContactId: number | undefined;
  emails: (string | undefined)[];
  phoneNumbers: (string | undefined)[];
  secondaryContactIds: (number | null)[];
}
