import { getSession } from '@/app/(auth)/login/actions';

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (session) {
      return {
        username: session.username,
        userId: session.userId
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}