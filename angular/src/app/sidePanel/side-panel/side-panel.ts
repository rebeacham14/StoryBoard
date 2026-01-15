// Notes:
// project scope - display recent notes + projects
// notes scope - display toipice (characters, items, locations, events) (draggable)


import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  imports: [],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.css',
})
export class SidePanel {


  sidePanelVisible: boolean = true;

  projectView: boolean = true;

  notesView: boolean = false;

  curentSection: string = '';


  // create event emitter for section selection
  private onSelectSection = new EventEmitter<string>();

  // make event emitter accessible
  @Output()
  public onSelectSectionEvent = this.onSelectSection;

  // function called when section is selected
  selectSection(section: string) {

    // toggle notes view
    this.projectView = false;
    this.notesView = true;    


    
    // pass selected section to emitter
    this.onSelectSection.emit(section);
  }


  selectProject(project: string) {
    
    // pass selected project to emitter
    // this.onSelectProject.emit('HOME');

    console.log("Selected project: " + project);

  }

  hideSidePanel() : void {
    this.sidePanelVisible = !this.sidePanelVisible;
  }

  toggleProjectScope() : void {
    this.switchScopeView('project');
  }

  toggleNotesScope() : void {
    this.switchScopeView('notes');
  }

  switchScopeView(scope : string) : void {

    // on toggle, clear view
    this.projectView = false;
    this.notesView = false;    

    // activate the selected view
    if(scope === 'project') {
      this.projectView = true;
    }
    else if(scope === 'notes') {
      this.notesView = true;
    }
  }

  parentDirect(section: string, scope: string) : void {
    this.curentSection = section;
    this.switchScopeView(scope);
  }




}
