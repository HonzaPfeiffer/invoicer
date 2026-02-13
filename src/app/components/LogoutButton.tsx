'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      Log Out
    </button>
  );
}
