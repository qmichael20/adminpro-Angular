import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
})
export class PromisesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){

    const promise = new Promise((resolve) => {
      fetch('https://reqres.in/api/users') 
      .then(response => response.json())
      .then(body => resolve(body.data)); 
  
    })

    return promise
  }
}
