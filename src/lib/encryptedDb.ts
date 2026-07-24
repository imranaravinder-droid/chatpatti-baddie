import Dexie, { type Table } from 'dexie';

interface Conversation {
  id: string;
  createdAt: Date;
  title: string;
}

interface EncryptedMessage {
  id?: number;
  conversationId: string;
  role: string;
  encryptedContent: string;
  timestamp: Date;
}

export class EncryptedChatDB extends Dexie {
  conversations!: Table<Conversation, string>;
  messages!: Table<EncryptedMessage, number>;

  constructor() {
    super('PrivateEncryptedChatDB');
    this.version(1).stores({
      conversations: 'id, createdAt, title',
      messages: '++id, conversationId, role, encryptedContent, timestamp',
    });
  }
}

export const encryptedDb = new EncryptedChatDB();

export async function deleteConversation(conversationId: string) {
  await encryptedDb.transaction('rw', encryptedDb.conversations, encryptedDb.messages, async () => {
    await encryptedDb.messages.where('conversationId').equals(conversationId).delete();
    await encryptedDb.conversations.delete(conversationId);
  });
}

export async function nukeAllHistory() {
  await encryptedDb.transaction('rw', encryptedDb.conversations, encryptedDb.messages, async () => {
    await encryptedDb.messages.clear();
    await encryptedDb.conversations.clear();
  });
}
