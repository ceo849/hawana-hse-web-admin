// src/auth/api.ts

export type AuthResponse = {
  ok: true;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // مهم: يضمن حفظ/إرسال الكوكيز
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // نفس رسالة السيرفر لو موجودة
    const msg =
      (data && (data.message || data.error)) || `Login failed (${res.status})`;
    throw new Error(msg);
  }

  return { ok: true };
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});
}