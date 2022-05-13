import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementator',
  templateUrl: './incrementator.component.html',
  styles: [],
})
export class IncrementatorComponent implements OnInit {
  @Input() progress: number = 50;
  @Input() btnClass: string = 'btn-primary';

  @Output() progressChange: EventEmitter<number> = new EventEmitter();

  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  changeValue(value: number) {
    if (this.progress >= 100 && value >= 0) {
      this.progressChange.emit(100);
      return (this.progress = 100);
    }

    if (this.progress <= 0 && value < 0) {
      this.progressChange.emit(0);
      return (this.progress = 0);
    }

    this.progressChange.emit((this.progress += value));
    return (this.progress += value);
  }

  onChange(event: number) {
    const value = event;
    if (value >= 100) {
      this.progress = 100;
    } else if (value <= 0) {
      this.progress = 0;
    } else {
      this.progress = value;
    }
    this.progressChange.emit(this.progress);
  }
}
