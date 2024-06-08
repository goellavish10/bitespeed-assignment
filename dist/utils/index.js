"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponseObj = void 0;
const generateResponseObj = (primaryContactId, emails, phoneNumbers, secondaryContactIds) => {
    const responseObj = {
        contact: {
            primaryContactId,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    };
    return responseObj;
};
exports.generateResponseObj = generateResponseObj;
