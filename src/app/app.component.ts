import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'whether';
  // isHome = true;
  /**
   *
   */
  constructor(
    private router: Router
  ) { }

  goToLink(path) {

    // this.isHome = path === 'home';
    debugger
    this.router.navigateByUrl(path);
  }
}
