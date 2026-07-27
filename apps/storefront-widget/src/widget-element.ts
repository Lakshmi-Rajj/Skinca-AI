export class SkincareWidgetElement extends HTMLElement {
  private shadow: ShadowRoot;
  private isOpen = false;
  private currentStep = 1;
  private skinType = 'COMBINATION';
  private primaryConcern = 'acne';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private toggleWidget() {
    this.isOpen = !this.isOpen;
    this.render();
  }

  private setSkinType(type: string) {
    this.skinType = type;
    this.render();
  }

  private nextStep() {
    this.currentStep = Math.min(3, this.currentStep + 1);
    this.render();
  }

  private prevStep() {
    this.currentStep = Math.max(1, this.currentStep - 1);
    this.render();
  }

  private render() {
    const primaryColor = this.getAttribute('data-primary-color') || '#1c1917';
    const position = this.getAttribute('data-position') || 'bottom-right';

    this.shadow.innerHTML = `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 999999;
          position: fixed;
          ${position.includes('bottom') ? 'bottom: 24px;' : 'top: 24px;'}
          ${position.includes('right') ? 'right: 24px;' : 'left: 24px;'}
        }
        .launcher-button {
          background-color: ${primaryColor};
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 14px 24px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s ease;
        }
        .launcher-button:hover {
          transform: scale(1.05);
        }
        .modal-card {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 380px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          border: 1px solid #e7e5e4;
          overflow: hidden;
          display: ${this.isOpen ? 'block' : 'none'};
        }
        .modal-header {
          background: ${primaryColor};
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          padding: 20px;
          max-height: 480px;
          overflow-y: auto;
        }
        .option-btn {
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          border: 1px solid #e7e5e4;
          border-radius: 8px;
          margin-bottom: 8px;
          background: #fafaf9;
          cursor: pointer;
          font-size: 13px;
        }
        .option-btn.selected {
          border-color: ${primaryColor};
          background: #f5f5f4;
          font-weight: 600;
        }
        .action-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        .btn-action {
          background: ${primaryColor};
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }
        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: #1c1917;
          margin-bottom: 12px;
        }
        .routine-item {
          background: #f5f5f4;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 6px;
          font-size: 12px;
        }
      </style>

      <button class="launcher-button" id="toggle-btn">
        <span>✨ Skincare Routine Finder</span>
      </button>

      <div class="modal-card">
        <div class="modal-header">
          <strong style="font-size: 15px;">Dermatological Assistant</strong>
          <span style="cursor:pointer;" id="close-btn">✕</span>
        </div>
        <div class="modal-body">
          ${
            this.currentStep === 1
              ? `
            <div class="step-title">Step 1: Select Your Skin Type</div>
            <button class="option-btn ${this.skinType === 'DRY' ? 'selected' : ''}" data-type="DRY">Dry Skin</button>
            <button class="option-btn ${this.skinType === 'OILY' ? 'selected' : ''}" data-type="OILY">Oily Skin</button>
            <button class="option-btn ${this.skinType === 'COMBINATION' ? 'selected' : ''}" data-type="COMBINATION">Combination Skin</button>
            <button class="option-btn ${this.skinType === 'SENSITIVE' ? 'selected' : ''}" data-type="SENSITIVE">Sensitive Skin</button>
            <div class="action-bar">
              <span></span>
              <button class="btn-action" id="next-btn">Next →</button>
            </div>
          `
              : this.currentStep === 2
              ? `
            <div class="step-title">Step 2: Target Skin Concern</div>
            <button class="option-btn selected">Acne & Blemishes</button>
            <button class="option-btn">Hyperpigmentation</button>
            <button class="option-btn">Fine Lines & Aging</button>
            <div class="action-bar">
              <button class="btn-action" id="prev-btn">← Back</button>
              <button class="btn-action" id="next-btn">Find Routine →</button>
            </div>
          `
              : `
            <div class="step-title">Your Custom Routine</div>
            <div style="font-size:12px; color:#57534e; margin-bottom:12px;">
              Tailored for <strong>${this.skinType}</strong> skin.
            </div>
            <div class="routine-item"><strong>AM Cleanse:</strong> Gentle Hydrating Cleanser</div>
            <div class="routine-item"><strong>AM Treat:</strong> Niacinamide 10% Serum</div>
            <div class="routine-item"><strong>AM Protect:</strong> Broad Spectrum SPF 50</div>
            <div class="routine-item"><strong>PM Repair:</strong> Night Barrier Recovery Balm</div>
            <div class="action-bar" style="margin-top:20px;">
              <button class="btn-action" id="prev-btn">← Edit</button>
              <button class="btn-action" id="close-btn-2">Done</button>
            </div>
          `
          }
        </div>
      </div>
    `;

    this.shadow.querySelector('#toggle-btn')?.addEventListener('click', () => this.toggleWidget());
    this.shadow.querySelector('#close-btn')?.addEventListener('click', () => this.toggleWidget());
    this.shadow.querySelector('#close-btn-2')?.addEventListener('click', () => this.toggleWidget());
    this.shadow.querySelector('#next-btn')?.addEventListener('click', () => this.nextStep());
    this.shadow.querySelector('#prev-btn')?.addEventListener('click', () => this.prevStep());

    this.shadow.querySelectorAll('[data-type]').forEach((btn) => {
      btn.addEventListener('click', (e: any) => {
        this.setSkinType(e.target.getAttribute('data-type'));
      });
    });
  }
}

if (!customElements.get('skincare-recommendation-widget')) {
  customElements.define('skincare-recommendation-widget', SkincareWidgetElement);
}
