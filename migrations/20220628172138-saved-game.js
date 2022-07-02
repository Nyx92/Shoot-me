module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('savedgames', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        // This links the user_id column to the id column in the categories table
        references: {
          model: 'users',
          key: 'id',
        },
      },
      enemies_pos: {
        type: Sequelize.STRING(99999),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('savedgames');
  },
};
