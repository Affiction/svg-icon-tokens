import { computed, Directive, input } from '@angular/core';
import { IconName } from './icon-name';

@Directive({
  selector: 'mat-icon[icon]',
  host: {
    class: 'app-icon',
    '[style.--icon]': 'url()',
  },
})
export class IconDirective {
  readonly icon = input.required<IconName>();
  protected readonly url = computed(() => `url(/icons/${this.icon()}.svg)`);
}
