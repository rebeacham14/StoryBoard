import { Component, Output } from '@angular/core';
import { CdkDrag, CdkDragHandle, DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-widget-panel',
  imports: [DragDropModule],
  templateUrl: './widget-panel.html',
  styleUrl: './widget-panel.css',
})

export class WidgetPanel {
  
  // widget items listed in panel
  // widgetItems = ['Text', 'Image', 'Refference'];
  widgetItems = ['Text'];
  
  // Bool for widget pannel toggle
  widgetPanelVisible: boolean = true;

  // A unique ID for the main container is useful for connection logic
  widgetContainerId = 'widget-list'; 

  // A unique ID for the dashboard container
  dashboardContainerId = 'dashboard-list';



  private onDrop = new EventEmitter<CdkDragDrop<string[]>>();

  @Output()
  public onDropEvent = this.onDrop;

  drop(event: CdkDragDrop<string[]>) {
    this.onDrop.emit(event);
  }

  hideWidgetPanel(): void {
    this.widgetPanelVisible = !this.widgetPanelVisible;
  }

}
