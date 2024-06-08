import { Model, Optional } from "sequelize";
interface ContactAttributes {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number | null;
    linkPrecedence: "primary" | "secondary";
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
interface ContactCreationAttributes extends Optional<ContactAttributes, "id"> {
}
declare class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: "primary" | "secondary";
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default Contact;
