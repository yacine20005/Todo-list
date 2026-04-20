import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelTask } from '../model/ModelTask';
import { catchError, map, Observable, of, tap } from 'rxjs';

interface TodoResponse {
    todos: ModelTask[];
}

interface CreateTodo {
    label: string;
}

interface UpdateTodo {
    label: string;
    done: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private readonly apiUrl = 'https://europe-west1-cours-angular-263913.cloudfunctions.net/todoapp/todo';

    private todos: ModelTask[] = [];

    constructor(private http: HttpClient) {}

    public getTodos(): Observable<ModelTask[]> {
        return this.http.get<TodoResponse>(this.apiUrl).pipe(
            map(response => response.todos),
            tap(todos => {
                this.todos = todos;
            })
        );
    }

    public createTodo(label: string): Observable<boolean> {
        const body: CreateTodo = { label };

        return this.http.post<ModelTask>(this.apiUrl, body).pipe(
            tap(todo => {
                this.todos = [...this.todos, todo];
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    public updateTodo(todo: ModelTask): Observable<boolean> {
        const body: UpdateTodo = {
            label: todo.label,
            done: todo.done,
        };

        return this.http.put<ModelTask>(`${this.apiUrl}/${todo.id}`, body).pipe(
            tap(updatedTodo => {
                this.todos = this.todos.map(currentTodo =>
                    currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo
                );
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    public deleteTodo(id: string): Observable<boolean> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.todos = this.todos.filter(todo => todo.id !== id);
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }
}
