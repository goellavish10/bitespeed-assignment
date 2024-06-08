"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contacts", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null
      },
      linkPrecedence: {
        type: Sequelize.ENUM("primary", "secondary"),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
      // Additional columns can be added here
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contacts");
  }
};
