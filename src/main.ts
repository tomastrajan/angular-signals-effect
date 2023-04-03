import 'zone.js/dist/zone';
import { Component, signal, computed, effect } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  template: `
    <h1>🚦Angular signals fun - effect()</h1>
    <p>Open the console and try to click on the buttons...</p>
    <button (click)="update()">Update</button>
    <button (click)="updateToSameValue()">Update to the same value</button>
  `,
})
export class App {
  counter = signal(0);

  constructor() {
    effect(() => {
      console.log('called', this.counter());
    });

    // sync updates send push notifications
    // to the consumer effect() because it references counter()
    this.counter.set(1);
    this.counter.set(2);
    this.counter.update((current) => current + 1);
    this.counter.update((current) => current + 1);
    // the effect starts as dirty
    // and runs during change detection (refresh view)
    // and will therefore log only once with value of 4
  }

  update() {
    // repeated calls to the set will send push notification
    // about counter signal producer might have changed
    // effect then runs as click effect also triggers CD
    // effect polls producer if value has changed
    this.counter.update((current) => current + 1);
    this.counter.update((current) => current + 1);
    this.counter.update((current) => current + 1);
    // the value has changed so effect will run on every click
    // effect will print only single log statement per click
    // with the prev value + 3 because it only pulls the
    // current value of the counter at the time it runs (during CD)
  }

  updateToSameValue() {
    // repeated calls to the set  (and update) will NOT send
    // push notificatin about counter signal producer might have changed
    // effect then runs as click effect also triggers CD
    // effect polls producer if value has changed
    this.counter.set(100);
    this.counter.set(100);
    this.counter.set(100);
    // this.counter.update((current) => 100);
    // only first call will log because after that
    // running effect will determine that producer value
    // has not changed even though it was notified
    // and there is a CD because of subsequent events
  }
}

bootstrapApplication(App);
