
import { getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';

export type User = {
  id: string;
  email: string;
  name: string | null;
  emailNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  surah: number;
  startAyah: number;
  endAyah: number;
  startPage: number | null;
  endPage: number | null;
  date: Date;
  duration: number | null;
};

export type Goal = {
  id: string;
  userId: string;
  type: string;
  targetAmount: number | null;
  deadline: Date | null;
  status: string;
  lastNotificationSent: Date | null;
  notificationCount: number;
  createdAt: Date;
};

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      const db = await getDb();
      return db.get('SELECT * FROM User WHERE email = ?', where.email);
    },
    create: async ({ data }: { data: any }) => {
      const db = await getDb();
      const newUser = {
        id: uuidv4(),
        email: data.email,
        name: data.name || null,
        emailNotifications: data.emailNotifications ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.run(
        'INSERT INTO User (id, email, name, emailNotifications, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.emailNotifications,
        newUser.createdAt.toISOString(),
        newUser.updatedAt.toISOString()
      );
      return newUser;
    },
    findMany: async ({ where }: { where: any }) => {
      const db = await getDb();
      if (!where || Object.keys(where).length === 0) {
        return db.all('SELECT * FROM User');
      }
      const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(where);
      return db.all(`SELECT * FROM User WHERE ${conditions}`, ...values);
    },
  },
  session: {
    create: async ({ data }: { data: any }) => {
      const db = await getDb();
      const newSession = {
        id: uuidv4(),
        userId: data.userId,
        surah: data.surah,
        startAyah: data.startAyah,
        endAyah: data.endAyah,
        startPage: data.startPage || null,
        endPage: data.endPage || null,
        date: new Date(),
        duration: data.duration || null,
      };
      await db.run(
        'INSERT INTO Session (id, userId, surah, startAyah, endAyah, startPage, endPage, date, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        newSession.id,
        newSession.userId,
        newSession.surah,
        newSession.startAyah,
        newSession.endAyah,
        newSession.startPage,
        newSession.endPage,
        newSession.date.toISOString(),
        newSession.duration
      );
      return newSession;
    },
    findMany: async ({ where }: { where: any }) => {
      const db = await getDb();
      return db.all('SELECT * FROM Session WHERE userId = ?', where.userId);
    },
  },
  goal: {
    create: async ({ data }: { data: any }) => {
      const db = await getDb();
      const newGoal = {
        id: uuidv4(),
        userId: data.userId,
        type: data.type,
        targetAmount: data.targetAmount || null,
        deadline: data.deadline || null,
        status: 'ACTIVE',
        lastNotificationSent: null,
        notificationCount: 0,
        createdAt: new Date(),
      };
      await db.run(
        'INSERT INTO Goal (id, userId, type, targetAmount, deadline, status, lastNotificationSent, notificationCount, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        newGoal.id,
        newGoal.userId,
        newGoal.type,
        newGoal.targetAmount,
        newGoal.deadline ? newGoal.deadline.toISOString() : null,
        newGoal.status,
        newGoal.lastNotificationSent,
        newGoal.notificationCount,
        newGoal.createdAt.toISOString()
      );
      return newGoal;
    },
    findMany: async ({ where }: { where: any }) => {
      const db = await getDb();
      return db.all('SELECT * FROM Goal WHERE userId = ?', where.userId);
    },
    findFirst: async ({ where }: { where: any }) => {
      const db = await getDb();
      return db.get('SELECT * FROM Goal WHERE userId = ? AND type = ?', where.userId, where.type);
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = await getDb();
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), where.id];
      await db.run(`UPDATE Goal SET ${fields} WHERE id = ?`, ...values);
      return db.get('SELECT * FROM Goal WHERE id = ?', where.id);
    },
    delete: async ({ where }: { where: any }) => {
      const db = await getDb();
      const result = await db.run('DELETE FROM Goal WHERE id = ?', where.id);
      return result.changes > 0;
    },
  },
};
