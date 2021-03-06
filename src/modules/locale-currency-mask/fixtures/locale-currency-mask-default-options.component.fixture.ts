import { Component, ViewChild } from '@angular/core';
import { SkyContribLocaleCurrencyMaskDirective } from '../locale-currency-mask.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './locale-currency-mask-default-options.component.fixture.html'
})
export class LocaleCurrencyMaskDefaultTestComponent {
  @ViewChild('maskInput') public input: HTMLInputElement;
}
