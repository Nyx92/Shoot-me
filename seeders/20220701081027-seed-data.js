module.exports = {
  up: async (queryInterface) => {
    const gamestateList = [
      {
        score: 300,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 400,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 500,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 600,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 700,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 800,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 900,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 1000,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        score: 1100,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert categories before items because items reference categories
    queryInterface.bulkInsert(
      'gamestates',
      gamestateList,
      { returning: true },
    );
  },

  down: async (queryInterface) => {
    // Delete item before category records because items reference categories
    await queryInterface.bulkDelete('gamestates', null, {});
  },
};
