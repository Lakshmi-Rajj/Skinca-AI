import { SessionManager, WidgetSessionData } from '../session/session-manager';
import { ThemeLoader, WidgetThemeConfig } from '../theme/theme-loader';
import { LocalizationManager } from '../localization/translations';

export interface WidgetOptions {
  tenantId: string;
  container: string | HTMLElement;
  apiHost?: string;
  language?: string;
  theme?: WidgetThemeConfig;
}

export class SkincareWidget {
  private options: WidgetOptions;
  private containerElement: HTMLElement | null = null;
  private session: WidgetSessionData | null = null;
  private loc: LocalizationManager;
  private mounted = false;

  constructor(options: WidgetOptions) {
    if (!options.tenantId) {
      throw new Error('SkincareWidget initialization requires a tenantId');
    }
    this.options = {
      apiHost: 'http://localhost:3000',
      language: 'en',
      ...options,
    };
    this.loc = new LocalizationManager(this.options.language);
  }

  static init(options: WidgetOptions): SkincareWidget {
    const instance = new SkincareWidget(options);
    instance.mount();
    return instance;
  }

  async mount(): Promise<void> {
    if (this.mounted) return;

    if (typeof this.options.container === 'string') {
      this.containerElement = document.querySelector(this.options.container);
    } else {
      this.containerElement = this.options.container;
    }

    if (!this.containerElement) {
      console.warn(`SkincareWidget container '${this.options.container}' not found in DOM.`);
      return;
    }

    await this.initSession();

    if (this.options.theme) {
      ThemeLoader.applyTheme(this.options.theme, this.containerElement);
    }

    this.renderInitialView();
    this.mounted = true;
  }

  unmount(): void {
    if (this.containerElement) {
      this.containerElement.innerHTML = '';
    }
    this.mounted = false;
  }

  destroy(): void {
    this.unmount();
    SessionManager.clearSession();
    this.session = null;
  }

  async refresh(): Promise<void> {
    this.unmount();
    await this.mount();
  }

  private async initSession(): Promise<void> {
    let existing = SessionManager.getSession();
    if (!existing || existing.tenantId !== this.options.tenantId) {
      try {
        const res = await fetch(`${this.options.apiHost}/api/v1/widget/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId: this.options.tenantId }),
        });
        if (res.ok) {
          const data = await res.json();
          existing = {
            sessionId: data.sessionId,
            tenantId: data.tenantId,
            expiresAt: data.expiresAt,
          };
          SessionManager.saveSession(existing);
        }
      } catch (err) {
        console.error('Failed to initialize widget session:', err);
      }
    }
    this.session = existing;
  }

  private renderInitialView(): void {
    if (!this.containerElement) return;

    this.containerElement.innerHTML = `
      <div class="skincare-widget-card" style="border: 1px solid #E4E4E7; border-radius: var(--skincare-widget-radius, 8px); padding: 24px; font-family: var(--skincare-widget-font, sans-serif); background: #FFFFFF;">
        <h3 style="margin-top: 0; font-size: 20px; color: var(--skincare-widget-primary, #000);">${this.loc.t('welcomeTitle')}</h3>
        <p style="color: #71717A; font-size: 14px; line-height: 1.5;">${this.loc.t('welcomeSub')}</p>
        <button id="skincare-widget-start-btn" style="background: var(--skincare-widget-primary, #000); color: #FFF; border: none; border-radius: 6px; padding: 10px 20px; font-weight: 600; cursor: pointer;">${this.loc.t('startBtn')}</button>
      </div>
    `;

    const btn = this.containerElement.querySelector('#skincare-widget-start-btn');
    if (btn) {
      btn.addEventListener('click', () => this.renderQuestionnaire());
    }
  }

  private renderQuestionnaire(): void {
    if (!this.containerElement) return;

    this.containerElement.innerHTML = `
      <div class="skincare-widget-card" style="border: 1px solid #E4E4E7; border-radius: var(--skincare-widget-radius, 8px); padding: 24px; font-family: var(--skincare-widget-font, sans-serif); background: #FFFFFF;">
        <h4 style="margin-top: 0; font-size: 16px; color: #000;">${this.loc.t('skinTypeQuestion')}</h4>
        <select id="skincare-skin-type" style="width: 100%; padding: 8px; margin-bottom: 16px; border-radius: 4px; border: 1px solid #CCC;">
          <option value="DRY">Dry Skin</option>
          <option value="OILY">Oily Skin</option>
          <option value="COMBINATION">Combination Skin</option>
          <option value="SENSITIVE">Sensitive Skin</option>
          <option value="NORMAL">Normal Skin</option>
        </select>
        <button id="skincare-widget-submit-btn" style="background: var(--skincare-widget-accent, #4A90E2); color: #FFF; border: none; border-radius: 6px; padding: 10px 20px; font-weight: 600; cursor: pointer; width: 100%;">${this.loc.t('submitBtn')}</button>
      </div>
    `;

    const submitBtn = this.containerElement.querySelector('#skincare-widget-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitQuestionnaire());
    }
  }

  private async submitQuestionnaire(): Promise<void> {
    if (!this.containerElement || !this.session) return;

    const select = this.containerElement.querySelector('#skincare-skin-type') as HTMLSelectElement;
    const skinType = select ? select.value : 'DRY';

    try {
      const res = await fetch(`${this.options.apiHost}/api/v1/widget/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.session.sessionId,
          tenantId: this.options.tenantId,
          skinType,
          skinConcerns: ['DEHYDRATION'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        this.renderRoutineResults(data);
      }
    } catch (err) {
      console.error('Failed to submit questionnaire:', err);
    }
  }

  private renderRoutineResults(data: any): void {
    if (!this.containerElement) return;

    this.containerElement.innerHTML = `
      <div class="skincare-widget-card" style="border: 1px solid #E4E4E7; border-radius: var(--skincare-widget-radius, 8px); padding: 24px; font-family: var(--skincare-widget-font, sans-serif); background: #FFFFFF;">
        <h3 style="margin-top: 0; color: var(--skincare-widget-primary, #000);">${this.loc.t('morningRoutineTitle')}</h3>
        <p style="font-size: 14px; color: #4B5563;">${data.explanation}</p>
        <button id="skincare-widget-reset-btn" style="margin-top: 16px; background: #F4F4F5; color: #000; border: 1px solid #E4E4E7; border-radius: 6px; padding: 8px 16px; font-weight: 500; cursor: pointer;">${this.loc.t('resetBtn')}</button>
      </div>
    `;

    const resetBtn = this.containerElement.querySelector('#skincare-widget-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.renderInitialView());
    }
  }
}

// Attach to window object for embed scripts
if (typeof window !== 'undefined') {
  (window as any).SkincareWidget = SkincareWidget;
}
