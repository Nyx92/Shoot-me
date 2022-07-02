export default function initSavedGameModel(sequelize, DataTypes) {
  return sequelize.define(
    'savedgame',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      score: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        // This links the userId column to the id column in the savedgame table
        references: {
          model: 'users',
          key: 'id',
        },
      },
      enemies_pos: {
        type: DataTypes.STRING(99999),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      underscored: true,
    },
  );
}
