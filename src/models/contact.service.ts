import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.ts";
import { ContactExistsResult } from "../interfaces/query.ts";
import moment from "moment";
import Contact from "./Contact.ts";
import { Op } from "sequelize";
import { QueryResponse } from "../interfaces/response.ts";
import e from "express";

export const contactExists = async (
  email: string | null,
  phoneNumber: string | null
): Promise<boolean> => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM contacts
      WHERE email = :email OR phoneNumber = :phoneNumber
    ) AS contactEntryExists;
  `;

  const results: ContactExistsResult[] = await sequelize.query(query, {
    replacements: { email, phoneNumber },
    type: QueryTypes.SELECT
  });

  console.log(results);

  return results[0].contactEntryExists === 1;
};

export const createPrimaryContactEntry = async (
  email: string,
  phoneNumber: string
): Promise<QueryResponse> => {
  let existingContacts = await Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }]
    },
    order: [["createdAt", "ASC"]]
  });
  console.log("EXISTING CONTACT");
  console.log(existingContacts);
  let primaryContactChanged: boolean = false;
  const onlyPrimaryContacts = existingContacts.filter(
    (contact) => contact.linkPrecedence === "primary"
  );
  console.log("ONLY PRIMARY CONTACTS");
  console.log(onlyPrimaryContacts);

  if (onlyPrimaryContacts.length >= 2) {
    onlyPrimaryContacts.splice(0, 1);
    console.log("ONLY PRIMARY CONTACTS");
    console.log(onlyPrimaryContacts);
    const updateContactPromises = onlyPrimaryContacts.map(async (contact) => {
      await Contact.update(
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
    });

    await Promise.all(updateContactPromises);

    const updatedContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }]
      },
      order: [["createdAt", "ASC"]]
    });
    console.log("UPDATED CONTACTS");
    console.log(updatedContacts);

    existingContacts = [...updatedContacts];

    primaryContactChanged = true;

    console.log("EXISTING CONTACTS");
    console.log(existingContacts);
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
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "secondary",
        linkedId:
          existingContacts[0].linkPrecedence === "primary"
            ? existingContacts[0].id
            : existingContacts[0].linkedId,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      });
      if (existingContacts[0].linkPrecedence !== "primary") {
        const primaryContact = await fetchPrimaryContact(
          existingContacts[0].linkedId
        );
        if (primaryContact) {
          existingContacts.unshift(primaryContact);
        }
      }
      existingContacts.push(newContact);
      let emails = existingContacts.map(({ email }) => email);
      emails = [...new Set(emails)];
      let phoneNumbers = existingContacts.map(({ phoneNumber }) => phoneNumber);
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
        secondaryContactIds: secondaryContactIdsArr.filter((id) => id !== null)
      };
    } else {
      if (
        existingContacts.length === 1 &&
        existingContacts[0].linkPrecedence === "primary"
      ) {
        const secondaryContactsLeft = await findAllRemainingSecondayContacts(
          existingContacts[0].id
        );

        existingContacts.push(...secondaryContactsLeft);
      }

      if (existingContacts[0].linkPrecedence !== "primary") {
        const primaryContact = await fetchPrimaryContact(
          existingContacts[0].linkedId
        );
        if (primaryContact) {
          existingContacts.unshift(primaryContact);
        }
      }
      let emails = existingContacts.map(({ email }) => email);
      emails = [...new Set(emails)];
      let phoneNumbers = existingContacts.map(({ phoneNumber }) => phoneNumber);
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
        secondaryContactIds: secondaryContactIdsArr.filter((id) => id !== null)
      };
    }
  }
  const newContact = await Contact.create({
    email,
    phoneNumber,
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
    linkPrecedence: "primary"
  });

  // Return details for primary contact
  return {
    primaryContactId: newContact.id,
    emails: [email],
    phoneNumbers: [phoneNumber],
    secondaryContactIds: []
  };
};

async function fetchPrimaryContact(primaryContactId: number | undefined) {
  return Contact.findByPk(primaryContactId);
}

async function findAllRemainingSecondayContacts(
  primaryContactId: number | undefined
): Promise<Contact[]> {
  return Contact.findAll({
    where: {
      linkedId: primaryContactId
    },
    order: [["createdAt", "ASC"]]
  });
}
