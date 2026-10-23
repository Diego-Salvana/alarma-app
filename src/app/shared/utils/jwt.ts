interface JwtPayload {
  exp?: number;
}

export function isTokenValid (token: string | null): boolean {
  if (!token) return false;

  try {
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(atob(payload)) as JwtPayload;

    return !!exp && exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
