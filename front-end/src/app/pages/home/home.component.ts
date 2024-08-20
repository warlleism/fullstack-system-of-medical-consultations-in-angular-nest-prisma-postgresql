import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';

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
    InputSwitchModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  link: string = '';
  checked: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    const link = localStorage.getItem('link');
    if (link) {
      this.link = link;
      this.router.navigate([link]);
    }

  }


  setLink(panel: string) {
    localStorage.setItem('link', panel);
    const link = localStorage.getItem('link');
    if (link)
      this.link = link;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
