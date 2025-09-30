import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {

  notification: any = {};

  constructor(private route: ActivatedRoute,) {
    this.notification = null;
    if (this.route.snapshot.data['recordData']) {
      this.notification = this.route.snapshot.data['recordData'].data;
    }
  }

  ngOnInit(): void {
  }

}
