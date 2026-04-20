import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { ModelTask } from '../model/ModelTask';
import { Observable, of } from 'rxjs';

// interface TodoResponse {
//     todos: ModelTask[];
// }

// interface CreateTodo {
//     label: string;
// }

// interface UpdateTodo {
//     label: string;
//     done: boolean;
// }

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    // API endpoint is commented out to allow the service to work without a backend, using localStorage instead.
    // private readonly apiUrl = 'http://localhost:3000/todo';
    private readonly storageKey = 'todos.local';

    private todos: ModelTask[] = [];
    private readonly isBrowser = typeof window !== 'undefined';

    // constructor(private http: HttpClient) {}
    constructor() {
        this.todos = this.loadTodos();
    }

    public getTodos(): Observable<ModelTask[]> {
        // return this.http.get<TodoResponse>(this.apiUrl).pipe(
        //     map(response => response.todos),
        //     tap(todos => {
        //         this.todos = todos;
        //     })
        // );

        return of([...this.todos]);
    }

    public createTodo(label: string): Observable<boolean> {
        // const body: CreateTodo = { label };

        // return this.http.post<ModelTask>(this.apiUrl, body).pipe(
        //     tap(todo => {
        //         this.todos = [...this.todos, todo];
        //     }),
        //     map(() => true),
        //     catchError(() => of(false))
        // );

        const todo: ModelTask = {
            id: this.generateId(),
            label,
            done: false,
            creationDate: Date.now()
        };

        this.todos = [...this.todos, todo];
        this.saveTodos();
        return of(true);
    }

    public updateTodo(todo: ModelTask): Observable<boolean> {
        // const body: UpdateTodo = {
        //     label: todo.label,
        //     done: todo.done,
        // };

        // return this.http.put<ModelTask>(`${this.apiUrl}/${todo.id}`, body).pipe(
        //     tap(updatedTodo => {
        //         this.todos = this.todos.map(currentTodo =>
        //             currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo
        //         );
        //     }),
        //     map(() => true),
        //     catchError(() => of(false))
        // );

        const existingTodo = this.todos.find(currentTodo => currentTodo.id === todo.id);
        if (!existingTodo) {
            return of(false);
        }

        this.todos = this.todos.map(currentTodo =>
            currentTodo.id === todo.id
                ? { ...currentTodo, label: todo.label, done: todo.done }
                : currentTodo
        );
        this.saveTodos();
        return of(true);
    }

    public deleteTodo(id: string): Observable<boolean> {
        // return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        //     tap(() => {
        //         this.todos = this.todos.filter(todo => todo.id !== id);
        //     }),
        //     map(() => true),
        //     catchError(() => of(false))
        // );

        const initialLength = this.todos.length;
        this.todos = this.todos.filter(todo => todo.id !== id);
        if (this.todos.length === initialLength) {
            return of(false);
        }

        this.saveTodos();
        return of(true);
    }

    private loadTodos(): ModelTask[] {
        if (!this.isBrowser) {
            return [];
        }

        const rawValue = window.localStorage.getItem(this.storageKey);
        if (!rawValue) {
            return [];
        }

        try {
            const parsed = JSON.parse(rawValue) as unknown;
            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.filter(this.isModelTask);
        } catch {
            return [];
        }
    }

    private saveTodos(): void {
        if (!this.isBrowser) {
            return;
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    private isModelTask(task: unknown): task is ModelTask {
        if (!task || typeof task !== 'object') {
            return false;
        }

        const candidate = task as Record<string, unknown>;
        return (
            typeof candidate['id'] === 'string' &&
            typeof candidate['label'] === 'string' &&
            typeof candidate['done'] === 'boolean' &&
            typeof candidate['creationDate'] === 'number'
        );
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
}
