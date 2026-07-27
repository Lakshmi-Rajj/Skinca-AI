export interface WidgetSessionData {
  sessionId: string;
  tenantId: string;
  expiresAt: string;
}

export class SessionManager {
  private static STORAGE_KEY = 'skincare_widget_session';

  static getSession(): WidgetSessionData | null {
    try {
      const raw = localStorage.getItem(SessionManager.STORAGE_KEY);
      if (!raw) return null;
      const data: WidgetSessionData = JSON.parse(raw);
      if (new Date(data.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(SessionManager.STORAGE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  static saveSession(session: WidgetSessionData): void {
    try {
      localStorage.setItem(SessionManager.STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(SessionManager.STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}
