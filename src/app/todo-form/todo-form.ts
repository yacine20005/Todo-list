import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-todo-form',
    imports: [FormsModule],
    templateUrl: './todo-form.html',
    styleUrl: './todo-form.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
    public readonly createTodo = output<string>();
    public label = '';

    public submit(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        const trimmedLabel = this.label.trim();
        if (!trimmedLabel) {
            return;
        }

        this.createTodo.emit(trimmedLabel);
        this.label = '';
        form.resetForm();
    }
}
