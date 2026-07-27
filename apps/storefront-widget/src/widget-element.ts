export class SkincareWidgetElement extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .widget-container { padding: 1rem; border-radius: 8px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      </style>
      <div class="widget-container">
        <p>Skincare Recommendation Widget Initialized</p>
      </div>
    `;
  }
}

if (!customElements.get('skincare-recommendation-widget')) {
  customElements.define('skincare-recommendation-widget', SkincareWidgetElement);
}
