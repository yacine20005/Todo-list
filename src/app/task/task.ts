import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModelTask } from '../model/ModelTask';
import { MessageService } from 'primeng/api';
import { CustomDatePipe } from '../custom-date.pipe';

@Component({
  selector: 'app-task',
  imports: [FormsModule, CustomDatePipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {

  task = input.required<ModelTask>();
  toggleEvent = output<ModelTask>();
  editEvent = output<string>();
  deleteEvent = output<string>();

  toggleEdit = false;
  editLabel = '';

  private messageService = inject(MessageService);

  public toggleDone() {
    this.toggleEvent.emit(this.task());
    const task = this.task();
    if (task.done) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Task not finished',
        detail: `"${task.label}" is marked as not finished`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Task finished',
        detail: `"${task.label}" is marked as finished`,
        life: 3000
      });
    }
  }

  public toggleEditMode() {
    this.toggleEdit = !this.toggleEdit;
  }

  public edit(newLabel: string) {
    this.toggleEdit = !this.toggleEdit;
    this.editEvent.emit(newLabel);
    this.messageService.add({
      severity: 'info',
      summary: 'Task edited',
      detail: `"${this.task().label}" is now "${newLabel}"`,
      life: 3000
    });
  }

  public deleteTask() {
    this.deleteEvent.emit(this.task().id);
  }
}
