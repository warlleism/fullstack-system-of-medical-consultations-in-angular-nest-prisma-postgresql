import { Component, ChangeDetectionStrategy, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatExpansionModule,
    CommonModule,
    MatIconModule,
    ScrollingModule,
    InputSwitchModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  link: string = '';
  checked: boolean = false;
  private isReduxMenuCalled: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const link = localStorage.getItem('link');
    if (link) {
      this.link = link;
      this.router.navigate([link]);
    }


    if (window.innerWidth >= 1100 && this.isReduxMenuCalled) {
      this.reduxMenu();
      this.isReduxMenuCalled = false;
    }

    if (window.innerWidth <= 1100 && !this.isReduxMenuCalled) {
      this.reduxMenu();
      this.isReduxMenuCalled = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1100 && !this.isReduxMenuCalled) {
      this.reduxMenu();
      this.isReduxMenuCalled = true;
    }
    if (event.target.innerWidth >= 1100 && this.isReduxMenuCalled) {
      this.reduxMenu();
      this.isReduxMenuCalled = false;
    }
  }

  reduxMenu() {
    const toggleClasses = (selectors: string, className: string) => {
      document.querySelectorAll(selectors).forEach(item => {
        item.classList.toggle(className);
      });
    };

    toggleClasses('#sidebar', 'active-menu');
    toggleClasses('#content', 'active-content');
    toggleClasses('#hidden-itens', 'hidden-itens');
    toggleClasses('#nav-itens-name', 'hidden-itens');
    toggleClasses('.mat-expansion-indicator svg', 'hidden-svg');
    toggleClasses('.mat-expansion-panel-header', 'padding-panel');
    toggleClasses('.mat-expansion-panel-header-description', 'mat_expansion-panel');
  }

  setLink(panel: string) {
    localStorage.setItem('link', panel);
    const link = localStorage.getItem('link');
    if (link) {
      this.link = link;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
