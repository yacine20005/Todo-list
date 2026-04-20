import { Component, signal, WritableSignal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModelTask } from '../model/ModelTask';
import { Task } from '../task/task';
import { MessageService } from 'primeng/api';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todolist',
  imports: [FormsModule, Task],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
})
export class Todolist implements OnInit {

  private messageService = inject(MessageService);
  private todoService = inject(TodoService);

  public tasks: WritableSignal<ModelTask[]> = signal([]);

  public newTaskLabel = '';

  ngOnInit() {
    this.refreshTodos();
  }

  public toggle(task: ModelTask) {
    this.todoService.updateTodo({ ...task, done: !task.done }).subscribe({
      next: (saved) => {
        if (saved) {
          this.refreshTodos();
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Update failed',
          detail: 'Impossible de mettre a jour la tache',
          life: 3000
        });
      }
    });
  }

  public addTask() {
    const label = this.newTaskLabel.trim();
    if (!label) {
      return;
    }

    this.todoService.createTodo(label).subscribe({
      next: (saved) => {
        if (!saved) {
          this.messageService.add({
            severity: 'error',
            summary: 'Create failed',
            detail: 'Impossible de creer la tache',
            life: 3000
          });
          return;
        }

        this.refreshTodos();
        this.newTaskLabel = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Task added',
          detail: `"${label}" has been added to the list`,
          life: 3000
        });
      }
    });
  }

  public edit(task: ModelTask, newLabel: string) {
    const label = newLabel.trim();
    if (!label) {
      return;
    }

    this.todoService.updateTodo({ ...task, label }).subscribe({
      next: (saved) => {
        if (saved) {
          this.refreshTodos();
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Edit failed',
          detail: 'Impossible de modifier la tache',
          life: 3000
        });
      }
    });
  }

  public delete(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.refreshTodos();
          this.messageService.add({
            severity: 'warn',
            summary: 'Task deleted',
            detail: 'La tache a bien ete supprimee',
            life: 3000
          });
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'Impossible de supprimer la tache',
          life: 3000
        });
      }
    });
  }

  private refreshTodos() {
    this.todoService.getTodos().subscribe({
      next: todos => this.tasks.set(todos),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Impossible de charger les taches',
          life: 3000
        });
      }
    });
  }
}