import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatExpansionModule, CommonModule, MatIconModule, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 

  link: string = '';

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
