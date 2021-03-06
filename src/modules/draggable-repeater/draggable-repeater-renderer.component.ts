import { Component, Input, TemplateRef, ViewChild, ViewContainerRef,
  ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'sky-contrib-draggable-repeater-renderer',
  template: '<ng-template #container></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyContribDraggableRepeaterRendererComponent implements OnInit {
  @Input() item: any;
  @Input() template: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  ngOnInit() {
    if (this.template !== undefined) {
      this.container.createEmbeddedView(this.template, this);
    }
  }
}
