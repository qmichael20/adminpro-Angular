import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [``],
})
export class AccountSettingsComponent implements OnInit {
  constructor(private settigsSevice: SettingsService) {}

  ngOnInit(): void {
    this.settigsSevice.checkCurrentTheme();
  }

  changeTheme(theme: string) {
    this.settigsSevice.changeTheme(theme);
  }
}
