import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog'; // Or your preferred dialog library
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ToastrconfirmService {
  constructor(private toastr: ToastrService, private dialog: MatDialog) {}

  confirm(message: string): Observable<boolean> {
    // Open a dialog with Yes/No options
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message },
    });

    // Return an observable with the user's choice
    return dialogRef.afterClosed();
  }

  showNotificationWithConfirmation(message: string, successCallback: () => void) {
    this.confirm(message).subscribe((confirmed) => {
      if (confirmed) {
        successCallback();
      } else {
        this.toastr.info('Action canceled.', 'Info');
      }
    });
  }
}
