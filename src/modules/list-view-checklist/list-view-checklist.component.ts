import {
  Component, Input, TemplateRef, ViewChild,  forwardRef, NgZone, ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { ListViewComponent } from '../list/list-view.component';
import { AsyncList } from 'microedge-rxstate';
import { ListItemModel } from '../list/state/items/item.model';
import { ListState, ListStateDispatcher } from '../list/state';
import { ChecklistState, ChecklistStateDispatcher, ChecklistStateModel } from './state';
import { ListViewChecklistItemsLoadAction } from './state/items/actions';
import { ListViewChecklistItemModel } from './state/items/item.model';
import { ListToolbarItemModel } from '../list/state/toolbar/toolbar-item.model';
import { Observable } from 'rxjs/Observable';
import { getData } from '../list/helpers';
import {
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction,
  ListSelectedLoadAction
} from '../list/state/selected/actions';

@Component({
  selector: 'sky-contrib-list-view-checklist',
  templateUrl: './list-view-checklist.component.html',
  styleUrls: ['./list-view-checklist.component.scss'],
  providers: [
    /* tslint:disable */
    { provide: ListViewComponent, useExisting: forwardRef(() => SkyContribListViewChecklistComponent)},
    /* tslint:enable */
    ChecklistState,
    ChecklistStateDispatcher,
    ChecklistStateModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyContribListViewChecklistComponent extends ListViewComponent implements AfterViewInit {
  @Input() set name(value: string) { this.viewName = value; }

  /* tslint:disable */
  @Input('search') searchFunction: (data: any, searchText: string) => boolean = this.search();
  @Input('category') categoryFieldSelector: string = 'category';
  @Input('label') labelFieldSelector: string = 'label';
  @Input('description') descriptionFieldSelector: string = 'description';
  @ViewChild('selectAllTemplate') selectAllTemplate: TemplateRef<any>;
  @ViewChild('clearSelectionsTemplate') clearSelectionsTemplate: TemplateRef<any>;
  /* tslint:enable */

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher,
    private checklistState: ChecklistState,
    private checklistDispatcher: ChecklistStateDispatcher,
    private zone: NgZone
  ) {
    super(state, 'Checklist View');

    let lastLastUpdate: any;
    Observable.combineLatest(
      this.state.map(s => s.items).distinctUntilChanged(),
      (items: AsyncList<ListItemModel>) => {
        let dataChanged = lastLastUpdate === undefined || items.lastUpdate !== lastLastUpdate;
        lastLastUpdate = items.lastUpdate;
        let newItems = items.items.map(item => {
          return new ListViewChecklistItemModel(item.id, {
            label:
              this.labelFieldSelector ? getData(item.data, this.labelFieldSelector) :
              undefined,
            description:
              this.descriptionFieldSelector ? getData(item.data, this.descriptionFieldSelector) :
              undefined,
            category:
              this.categoryFieldSelector ? getData(item.data, this.categoryFieldSelector) :
              undefined
          });
        });

        this.checklistDispatcher.next(
          new ListViewChecklistItemsLoadAction(newItems, true, dataChanged, items.count)
        );
      }
    )
    .subscribe();
  }

  public onViewActive() {
    if (this.searchFunction !== undefined) {
      this.dispatcher.searchSetFunctions([this.searchFunction]);
    }

    let fieldSelectors: Array<string> = [];
    if (this.labelFieldSelector) {
      fieldSelectors.push(this.labelFieldSelector);
    }
    if (this.descriptionFieldSelector) {
      fieldSelectors.push(this.descriptionFieldSelector);
    }
    if (this.categoryFieldSelector) {
      fieldSelectors.push(this.categoryFieldSelector);
    }
    this.dispatcher.searchSetFieldSelectors(fieldSelectors);
  }

  public ngAfterViewInit() {
    this.dispatcher.toolbarAddItems([
      new ListToolbarItemModel(
        {
          id: 'select-all',
          template: this.selectAllTemplate,
          location: 'right',
          index: 500,
          view: this.id
        }
      ),
      new ListToolbarItemModel(
        {
          id: 'clear-all',
          template: this.clearSelectionsTemplate,
          location: 'right',
          index: 500,
          view: this.id
        }
      )
    ]);
  }

  get items() {
    return this.checklistState.map(s => s.items.items);
  }

  public search() {
    return (data: any, searchText: string) => {
      if (this.labelFieldSelector !== undefined) {
        let label = getData(data, this.labelFieldSelector);
        if (label !== undefined && label.toString().toLowerCase().indexOf(searchText) !== -1) {
          return true;
        }
      }

      if (this.descriptionFieldSelector !== undefined) {
        let description = getData(data, this.descriptionFieldSelector);
        if (
          description !== undefined &&
          description.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
      }

      if (this.categoryFieldSelector !== undefined) {
        let category = getData(data, this.categoryFieldSelector);
        if (
          category !== undefined &&
          category.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
      }
    };
  }

  public itemSelected(id: string) {
    return this.state.map(s => s.selected.item[id] != null);
  }

  public setItemSelection(item: ListItemModel, ev: any) {
    this.dispatcher.next(new ListSelectedSetItemSelectedAction(item, ev.checked));
  }

  public setItemsSelection(items: ListItemModel[], checked: boolean = true) {
    this.dispatcher.next(new ListSelectedSetItemsSelectedAction(items, checked));
  }

  public clearSelections() {
    this.state.map(s => s.items.items)
      .take(1)
      .subscribe(items => {
        this.dispatcher.next(new ListSelectedLoadAction([]));
      });
  }

  public selectAll() {
    this.state.map(s => s.items.items)
      .take(1)
      .subscribe(items => {
        this.dispatcher.next(new ListSelectedSetItemsSelectedAction(items));
      });
  }

  private get loading() {
    return this.state.map(s => s.items.loading)
      .distinctUntilChanged();
  }
}
