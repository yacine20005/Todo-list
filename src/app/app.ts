
import { Component, signal } from '@angular/core';
import { Todolist } from './todolist/todolist';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  imports: [Todolist, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   title = signal('todolist');
}
