import { Component, signal, WritableSignal, inject, OnInit } from '@angular/core';
import { ModelTask } from '../model/ModelTask';
import { Task } from '../task/task';
import { MessageService } from 'primeng/api';
import { TodoService } from '../services/todo.service';
import { TodoForm } from '../todo-form/todo-form';

@Component({
  selector: 'app-todolist',
  imports: [Task, TodoForm],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
})
export class Todolist implements OnInit {

  private messageService = inject(MessageService);
  private todoService = inject(TodoService);

  public tasks: WritableSignal<ModelTask[]> = signal([]);

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
          detail: 'Unable to update the task',
          life: 3000
        });
      }
    });
  }

  public addTask(label: string) {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      return;
    }

    this.todoService.createTodo(trimmedLabel).subscribe({
      next: (saved) => {
        if (!saved) {
          this.messageService.add({
            severity: 'error',
            summary: 'Create failed',
            detail: 'Unable to create the task',
            life: 3000
          });
          return;
        }

        this.refreshTodos();
        this.messageService.add({
          severity: 'success',
          summary: 'Task added',
          detail: `"${trimmedLabel}" has been added to the list`,
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
          detail: 'Unable to edit the task',
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
            detail: 'The task has been deleted',
            life: 3000
          });
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'Unable to delete the task',
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
          detail: 'Unable to load the tasks',
          life: 3000
        });
      }
    });
  }
}