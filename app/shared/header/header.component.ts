import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  counter = 0;

  constructor(private bs: BackendService, public authService: AuthService) { }

  ngOnInit() {
  }
}
