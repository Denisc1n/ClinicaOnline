import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css'],
})
export class MedicalHistoryComponent implements OnInit {
  fields = this.data?.receivedData ?? [
    {
      fieldName: 'Peso',
      fieldValue: '',
    },
    {
      fieldName: 'Edad',
      fieldValue: '',
    },
    {
      fieldName: 'TemperaturaCorporal',
      fieldValue: '',
    },
    {
      fieldName: 'Presion',
      fieldValue: '',
    },
  ];
  name: string;
  constructor(
    public dialogRef: MatDialogRef<MedicalHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  add() {
    this.fields.push({ fieldName: '', fieldValue: '' });
  }
}
