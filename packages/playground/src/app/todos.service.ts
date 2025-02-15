import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MutationProvider, QueryClient, QueryProvider } from '@ngneat/query';
import { delay, tap } from 'rxjs';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);
  private useQuery = inject(QueryProvider);
  private useMutation = inject(MutationProvider);

  getTodos() {
    return this.useQuery(['todos'], () => {
      return this.http.get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos'
      );
    });
  }

  addTodoOriginal() {
    return this.useMutation(({ title }: { title: string }) => {
      return this.http
        .post<Todo>(`https://jsonplaceholder.typicode.com/todos`, { title })
        .pipe(
          tap(() => {
            this.queryClient.invalidateQueries(['todos']);
          })
        );
    });
  }

  addTodoBuiltIn({ title }: { title: string }) {
    return this.http
      .post<Todo>(`https://jsonplaceholder.typicode.com/todos`, { title })
      .pipe(
        tap(() => {
          this.queryClient.invalidateQueries(['todos']);
        })
      );
  }

  getTodo(id: number) {
    return this.useQuery(['todo', id], () => {
      return this.http
        .get<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .pipe(delay(1000));
    });
  }
}
