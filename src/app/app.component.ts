import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Importa Location

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform, 
    private router: Router,
    private location: Location // Inyecta Location
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      if (url === '/main' || url.startsWith('/auth/login') || url.startsWith('/auth/register')) {
        
        this.router.navigateByUrl('/tabs/chats');
      } else {
        
        this.location.back();
      }
    });
  }
}