import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from './icon-name';

@Component({
  selector: 'app-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.--icon]': 'url()',
  },
  styles: `
    :host {
      display: inline-block;
      flex: none;
      width: 1em;
      height: 1em;
      vertical-align: -0.125em;
      background-color: currentColor;
      -webkit-mask: var(--icon) no-repeat center / contain;
      mask: var(--icon) no-repeat center / contain;
      forced-color-adjust: none;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  protected readonly url = computed(() => `url(/icons/${this.name()}.svg)`);
}
