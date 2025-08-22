import { logoutUser } from '@/app/(auth)/login/actions';

export async function POST() {
  return logoutUser();
}
