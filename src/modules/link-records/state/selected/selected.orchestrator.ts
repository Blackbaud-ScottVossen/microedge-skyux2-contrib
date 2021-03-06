import { LinkRecordsStateOrchestrator } from '../link-records-state.rxstate';
import { AsyncItem } from 'microedge-rxstate';
import * as moment from 'moment';

import {
  LinkRecordsSelectedSetSelectedAction,
  LinkRecordsSelectedClearSelectedAction
} from './actions';

export class LinkRecordsSelectedOrchestrator
  extends LinkRecordsStateOrchestrator<AsyncItem<{[key: string]: {[keyField: string]: boolean}}>> {
  constructor() {
    super();

    this
      .register(LinkRecordsSelectedSetSelectedAction, this.setSelected)
      .register(LinkRecordsSelectedClearSelectedAction, this.clearSelected);
  }

  private setSelected(
    state: AsyncItem<{[key: string]: {[keyField: string]: boolean}}>,
    action: LinkRecordsSelectedSetSelectedAction):
      AsyncItem<{[key: string]: {[keyField: string]: boolean}}> {
      let newStateItem = Object.assign({}, state.item);
      let fields = (newStateItem[action.key]) ? newStateItem[action.key] : {};
      fields[action.fieldKey] = action.selected;
      newStateItem[action.key] = fields;

      return new AsyncItem<{[key: string]: {[keyField: string]: boolean}}>(
        newStateItem, moment(), state.loading);
  }

  private clearSelected(
    state: AsyncItem<{[key: string]: {[keyField: string]: boolean}}>,
    action: LinkRecordsSelectedSetSelectedAction):
      AsyncItem<{[key: string]: {[keyField: string]: boolean}}> {
      let newStateItem = Object.assign({}, state.item);
      newStateItem[action.key] = null;

      return new AsyncItem<{[key: string]: {[keyField: string]: boolean}}>(
        newStateItem, moment(), state.loading);
  }
}
