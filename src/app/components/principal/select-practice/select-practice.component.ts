import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-practice',
  templateUrl: './select-practice.component.html',
  styleUrls: ['./select-practice.component.css'],
})
export class SelectPracticeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SelectPracticeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
