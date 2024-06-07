import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.ts";
import { ContactExistsResult } from "../interfaces/query.ts";
import moment from "moment";

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
) => {
  const query = `
    INSERT INTO contacts (email, phoneNumber, linkPrecedence, createdAt, updatedAt)
    VALUES (:email, :phoneNumber, 'primary', '${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')
  `;

  const results = await sequelize.query(query, {
    replacements: { email, phoneNumber },
    type: QueryTypes.INSERT
  });
  console.log("New entry created");
  console.log(results);

  return results;
};
