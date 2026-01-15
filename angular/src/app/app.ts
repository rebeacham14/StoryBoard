import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import local components
import { DashView } from './dashboard/dash-view/dash-view';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashView],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  // isAuthenticated = false; // Placeholder for authentication status

  toggleSidebar() {
  //   const sidebar = document.getElementById('sideBar');
  //   if (sidebar) {
  //     this.isActive = !this.isActive
  //   }
  }

}
