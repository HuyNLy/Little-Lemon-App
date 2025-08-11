import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menuitems (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT, 
        price TEXT, 
        description TEXT, 
        image TEXT, 
        category TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        image TEXT,
        exclusiveOffers INTEGER,
        updatesNews INTEGER
      );
    `);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

// Fixed saveProfile function
export async function saveProfile(profile) {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO profile 
      (firstName, lastName, email, phone, image, exclusiveOffers, updatesNews) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.firstName || '',
        profile.lastName || '',
        profile.email || '',
        profile.phone || '',
        profile.image || '',
        profile.exclusiveOffers ? 1 : 0,
        profile.updatesNews ? 1 : 0
      ]
    );
    //console.log('Profile saved successfully:', profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

export async function findProfileByIdentity(email, firstName, lastName) {
  try {
    const rows = await db.getAllAsync(
      `SELECT * FROM profile WHERE email = ? AND firstName = ? AND lastName = ?`,
      [email, firstName, lastName]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
}

export async function getProfileByEmail(email) {
  try {
    const rows = await db.getAllAsync(`SELECT * FROM profile WHERE email = ?`, [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
}

export async function getMenuItems() {
  try {
    return await db.getAllAsync('SELECT * FROM menuitems');
  } catch (error) {
    throw error;
  }
}

export async function saveMenuItems(menuItems) {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    throw new Error('Invalid menu items data');
  }

  try {
    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(
        'INSERT INTO menuitems (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)'
      );

      for (const item of menuItems) {
        await statement.executeAsync([
          item.id,
          item.name,
          item.price,
          item.description,
          item.image,
          item.category
        ]);
      }

      await statement.finalizeAsync();
    });
  } catch (error) {
    throw error;
  }
}

export async function filterByQueryAndCategories(query, activeCategories) {
  if (!activeCategories || activeCategories.length === 0) {
    return [];
  }

  try {
    const placeholders = activeCategories.map(() => '?').join(', ');
    const params = [`%${query}%`, ...activeCategories];

    return await db.getAllAsync(
      `SELECT * FROM menuitems WHERE name LIKE ? AND category IN (${placeholders})`,
      params
    );
  } catch (error) {
    throw error;
  }
}