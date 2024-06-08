"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrimaryContactEntry = exports.contactExists = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const moment_1 = __importDefault(require("moment"));
const Contact_1 = __importDefault(require("./Contact"));
const sequelize_2 = require("sequelize");
const contactExists = (email, phoneNumber) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT EXISTS (
      SELECT 1
      FROM contacts
      WHERE email = :email OR phoneNumber = :phoneNumber
    ) AS contactEntryExists;
  `;
    const results = yield db_1.sequelize.query(query, {
      replacements: { email, phoneNumber },
      type: sequelize_1.QueryTypes.SELECT
    });
    return results[0].contactEntryExists === 1;
  });
exports.contactExists = contactExists;
const createPrimaryContactEntry = (email, phoneNumber) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let existingContacts = yield Contact_1.default.findAll({
      where: {
        [sequelize_2.Op.or]: [{ email }, { phoneNumber }]
      },
      order: [["createdAt", "ASC"]]
    });
    let primaryContactChanged = false;
    const onlyPrimaryContacts = existingContacts.filter(
      (contact) => contact.linkPrecedence === "primary"
    );
    if (onlyPrimaryContacts.length >= 2) {
      onlyPrimaryContacts.splice(0, 1);
      const updateContactPromises = onlyPrimaryContacts.map((contact) =>
        __awaiter(void 0, void 0, void 0, function* () {
          yield Contact_1.default.update(
            {
              linkPrecedence: "secondary",
              linkedId: existingContacts[0].id
            },
            {
              where: {
                id: contact.id
              }
            }
          );
        })
      );
      yield Promise.all(updateContactPromises);
      const updatedContacts = yield Contact_1.default.findAll({
        where: {
          [sequelize_2.Op.or]: [{ email }, { phoneNumber }]
        },
        order: [["createdAt", "ASC"]]
      });

      existingContacts = [...updatedContacts];
      primaryContactChanged = true;
    }
    if (existingContacts.length > 0) {
      let createSecondaryContact = false;
      if (!primaryContactChanged) {
        for (let i = 0; i < existingContacts.length; i++) {
          if (
            (existingContacts[i].email === email && phoneNumber === null) ||
            (existingContacts[i].phoneNumber === phoneNumber && email === null)
          ) {
            createSecondaryContact = false;
            break;
          } else if (
            existingContacts[i].email !== email ||
            existingContacts[i].phoneNumber !== phoneNumber
          ) {
            createSecondaryContact = true;
          } else if (
            existingContacts[i].email === email &&
            existingContacts[i].phoneNumber === phoneNumber
          ) {
            createSecondaryContact = false;
            break;
          }
        }
      }
      if (createSecondaryContact) {
        const newContact = yield Contact_1.default.create({
          email,
          phoneNumber,
          linkPrecedence: "secondary",
          linkedId:
            existingContacts[0].linkPrecedence === "primary"
              ? existingContacts[0].id
              : existingContacts[0].linkedId,
          createdAt: (0, moment_1.default)().toDate(),
          updatedAt: (0, moment_1.default)().toDate()
        });
        if (existingContacts[0].linkPrecedence !== "primary") {
          const primaryContact = yield fetchPrimaryContact(
            existingContacts[0].linkedId
          );
          if (primaryContact) {
            existingContacts.unshift(primaryContact);
          }
        }
        existingContacts.push(newContact);
        let emails = existingContacts.map(({ email }) => email);
        emails = [...new Set(emails)];
        let phoneNumbers = existingContacts.map(
          ({ phoneNumber }) => phoneNumber
        );
        phoneNumbers = [...new Set(phoneNumbers)];
        const secondaryContactIdsArr = existingContacts.map((contact) =>
          contact.linkPrecedence === "secondary" ? contact.id : null
        );
        return {
          primaryContactId:
            existingContacts[0].linkPrecedence === "primary"
              ? existingContacts[0].id
              : newContact.linkedId,
          emails: emails,
          phoneNumbers: phoneNumbers,
          secondaryContactIds: secondaryContactIdsArr.filter(
            (id) => id !== null
          )
        };
      } else {
        if (
          existingContacts.length === 1 &&
          existingContacts[0].linkPrecedence === "primary"
        ) {
          const secondaryContactsLeft = yield findAllRemainingSecondayContacts(
            existingContacts[0].id
          );
          existingContacts.push(...secondaryContactsLeft);
        }
        if (existingContacts[0].linkPrecedence !== "primary") {
          const primaryContact = yield fetchPrimaryContact(
            existingContacts[0].linkedId
          );
          if (primaryContact) {
            existingContacts.unshift(primaryContact);
          }
        }
        let emails = existingContacts.map(({ email }) => email);
        emails = [...new Set(emails)];
        let phoneNumbers = existingContacts.map(
          ({ phoneNumber }) => phoneNumber
        );
        phoneNumbers = [...new Set(phoneNumbers)];
        const secondaryContactIdsArr = existingContacts.map((contact) =>
          contact.linkPrecedence === "secondary" ? contact.id : null
        );
        return {
          primaryContactId:
            existingContacts[0].linkPrecedence === "primary"
              ? existingContacts[0].id
              : existingContacts[0].linkedId,
          emails: emails,
          phoneNumbers: phoneNumbers,
          secondaryContactIds: secondaryContactIdsArr.filter(
            (id) => id !== null
          )
        };
      }
    }
    const newContact = yield Contact_1.default.create({
      email,
      phoneNumber,
      createdAt: (0, moment_1.default)().toDate(),
      updatedAt: (0, moment_1.default)().toDate(),
      linkPrecedence: "primary"
    });
    // Return details for primary contact
    return {
      primaryContactId: newContact.id,
      emails: [email],
      phoneNumbers: [phoneNumber],
      secondaryContactIds: []
    };
  });
exports.createPrimaryContactEntry = createPrimaryContactEntry;
function fetchPrimaryContact(primaryContactId) {
  return __awaiter(this, void 0, void 0, function* () {
    return Contact_1.default.findByPk(primaryContactId);
  });
}
function findAllRemainingSecondayContacts(primaryContactId) {
  return __awaiter(this, void 0, void 0, function* () {
    return Contact_1.default.findAll({
      where: {
        linkedId: primaryContactId
      },
      order: [["createdAt", "ASC"]]
    });
  });
}
