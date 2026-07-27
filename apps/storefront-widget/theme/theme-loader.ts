export interface WidgetThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius?: string;
  fontFamily?: string;
}

export class ThemeLoader {
  static applyTheme(theme: WidgetThemeConfig, containerElement?: HTMLElement): void {
    const root = containerElement || document.documentElement;
    root.style.setProperty('--skincare-widget-primary', theme.primaryColor || '#000000');
    root.style.setProperty('--skincare-widget-secondary', theme.secondaryColor || '#F4F4F5');
    root.style.setProperty('--skincare-widget-accent', theme.accentColor || '#4A90E2');
    root.style.setProperty('--skincare-widget-radius', theme.borderRadius || '8px');
    root.style.setProperty('--skincare-widget-font', theme.fontFamily || 'Inter, sans-serif');
  }
}
