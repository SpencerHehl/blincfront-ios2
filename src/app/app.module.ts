import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NearMePage } from '../pages/posts/nearme/nearme.component';
import { PostFormModal } from '../shared/modals/posts/post-form.modal';
import { CommentFormModal } from '../shared/modals/comments/comment-form.modal';
import { LikesPage } from '../pages/likes/likes.component';
import { LoginPage } from '../pages/login/login.component';
import { ProfilePage } from '../pages/profile/profile.component';
import { MapViewPage } from '../pages/posts/mapview/mapview.component';
import { ListViewPage } from '../pages/posts/listview/listview.component';
import { CommentPage } from '../pages/comments/comment.component';
import { FollowListPage } from '../pages/profile/followlist/followlist.component';
import { NotificationPage } from '../pages/notifications/notification/notification.component';
import { NotificationListPage } from '../pages/notifications/listview/list.notification.component';
import { PostPage } from '../pages/posts/single/post.component';
import { PeoplePage } from '../pages/people/people.component';
import { SettingsPage } from '../pages/profile/settings/settings.component';

import { PostCardComponent } from '../shared/templates/posts/post.card'
import { CommentCardComponent } from '../shared/templates/comments/comment.card';
import { UserCardComponent } from '../shared/templates/user/user.card';
import { NotificationCardComponent } from '../shared/templates/notifications/notification.card';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';

import { PostService } from '../shared/services/post.service';
import { AuthService } from '../shared/services/auth.service';
import { ProfileService } from '../pages/profile/shared/profile.service';
import { CommentService } from '../shared/services/comment.service';
import { MediaService } from '../shared/services/media.service';
import { NotificationService } from '../shared/services/notifications.service';
import { DateAgePipe } from '../shared/pipes/date.pipe';
import { LocationService } from '../shared/services/location.service';
import { UserService } from '../shared/services/user.service';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '95855829'
  },
  'auth': {
    'google': {
      'webClientId': '819051050180-tjmq0ap9h09r4b594s54f2hicnsjgqlc.apps.googleusercontent.com',
      'scope': []
    },
    'facebook': {
      'scope': []
    }
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    NearMePage,
    PostCardComponent,
    CommentCardComponent,
    NotificationCardComponent,
    PostFormModal,
    LoginPage,
    DateAgePipe,
    ProfilePage,
    MapViewPage,
    ListViewPage,
    CommentPage,
    UserCardComponent,
    FollowListPage,
    NotificationPage,
    NotificationListPage,
    CommentFormModal,
    LikesPage,
    PostPage,
    PeoplePage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    NearMePage,
    PostFormModal,
    LoginPage,
    ProfilePage,
    MapViewPage,
    ListViewPage,
    CommentPage,
    FollowListPage,
    NotificationPage,
    NotificationListPage,
    CommentFormModal,
    LikesPage,
    PostPage,
    PeoplePage,
    SettingsPage
  ],
  providers: [
    PostService,
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    AuthService,
    ProfileService,
    CommentService,
    MediaService,
    NotificationService,
    Camera,
    LocationService,
    UserService,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
