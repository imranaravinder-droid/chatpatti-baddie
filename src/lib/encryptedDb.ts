import Dexie from 'dexie';

export const encryptedDb = new Dexie('PrivateEncryptedChatDB');

encryptedDb.version(1).stores({
  conversations: 'id, createdAt, title',
  messages: '++id, conversationId, role, encryptedContent, timestamp',
});

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
