import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  editAreaId: number;
  displayDialog = false;
  reloadArea: boolean;
  @Output()
  closeDisplayDialog = new EventEmitter<boolean>();
  @Output()
  emitEdit = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  editAreaEvent(event) {
    this.editAreaId = event;
    this.emitEdit.emit(true);
  }

  emitAreaReload() {
    this.reloadArea = true;
  }

  displayDialogFalse() {
    this.closeDisplayDialog.emit(this.displayDialog);
  }
}
