import { Component, OnDestroy } from '@angular/core';
import {
  filter,
  interval,
  map,
  Observable,
  retry,
  Subscription,
  take,
} from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy {
  intervalSubs: Subscription;

  constructor() {
    // this.returnObservable()
    //   .pipe(retry(1))
    //   .subscribe({
    //     next: (valor) => console.log('next', valor),
    //     error: (error) => console.log('error', error),
    //     complete: () => console.log('complete'),
    //   });

    this.intervalSubs = this.returnInterval().subscribe((valor) =>
      console.log(valor)
    );
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  returnObservable(): Observable<number> {
    let contador = -1;

    const obs$ = new Observable<number>((observer) => {
      const interval = setInterval(() => {
        contador++;

        observer.next(contador);

        if (contador === 2) {
          observer.error('i == 2');
        }

        if (contador === 4) {
          clearInterval(interval);
          observer.complete();
        }
      }, 1000);
    });

    return obs$;
  }

  returnInterval(): Observable<number> {
    return interval(100).pipe(
      map((valor) => valor + 1),
      filter((valor) => valor % 2 === 0)
      // take(10)
    );
  }
}
