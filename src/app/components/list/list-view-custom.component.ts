import { Component, forwardRef } from '@angular/core';
import { ListViewComponent } from '../../../modules/list';
import { ListState, ListStateDispatcher } from '../../../modules/list/state';

@Component({
  selector: 'sky-contrib-list-view-custom',
  templateUrl: './list-view-custom.component.html',
  providers: [
    {
      /* tslint:disable-next-line */
      provide: ListViewComponent, useExisting: forwardRef(() => SkyContribListViewCustomComponent)
    }
  ]
})
export class SkyContribListViewCustomComponent extends ListViewComponent {
  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher
  ) {
    super(state, 'Custom View');
  }

  get items() {
    return this.state.map(s => s.items.items);
  }
}
/* tslint: enable */
