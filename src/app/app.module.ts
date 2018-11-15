// Modules
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Environment Variables
import { environment } from '../environments/environment';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CharacterComponent } from './components/character/character.component';
import { PartyComponent } from './components/party/party.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AbilityScoresComponent } from './components/character/ability-scores/ability-scores.component';
import { CombatOptionsComponent } from './components/character/combat-options/combat-options.component';
import { SavingThrowsComponent } from './components/character/saving-throws/saving-throws.component';
import { ArmorClassComponent } from './components/character/armor-class/armor-class.component';
import { HitPointsComponent } from './components/character/hit-points/hit-points.component';
import { WeaponsComponent } from './components/weapons/weapons.component';
import { NewCharacterComponent } from './components/character/new-character/new-character.component';
import { AbilityScoresNewComponent } from './components/character/ability-scores-new/ability-scores-new.component';
import { AddPartyComponent } from './components/party/modals/add-party/add-party.component';
import { ConfirmDeletePartyComponent } from './components/party/modals/confirm-delete-party/confirm-delete-party.component';
import { CharacterJoinPartyComponent } from './components/party/modals/character-join-party/character-join-party.component';
import {
  ConfirmRemoveCharacterFromPartyComponent
} from './components/party/modals/confirm-remove-character-from-party/confirm-remove-character-from-party.component';
import { NewCharacterClassComponent } from './components/character/new-character-class/new-character-class.component';
import { LoginComponent } from './components/login/login.component';
import { AlignmentPickerComponent } from './components/character/modals/alignment-picker/alignment-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    HomeComponent,
    CharacterComponent,
    NewCharacterComponent,
    PartyComponent,
    CombatOptionsComponent,
    SavingThrowsComponent,
    ArmorClassComponent,
    HitPointsComponent,
    WeaponsComponent,
    AbilityScoresComponent,
    AbilityScoresNewComponent,
    AddPartyComponent,
    ConfirmDeletePartyComponent,
    CharacterJoinPartyComponent,
    ConfirmRemoveCharacterFromPartyComponent,
    NewCharacterClassComponent,
    LoginComponent,
    AlignmentPickerComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'dnd-party-tracker'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    AddPartyComponent,
    AlignmentPickerComponent,
    ConfirmDeletePartyComponent,
    CharacterJoinPartyComponent,
    ConfirmRemoveCharacterFromPartyComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
