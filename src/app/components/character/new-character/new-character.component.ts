import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbPopover, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth/auth.service';
import { CharacterService } from '../../../services/firebase/character/character.service';
import { AbilityScore } from '../../../models/character/ability-scores';
import { generateNewRandomHeight, generateNewRandomWeight, RaceId } from '../../../models/character/race';
import { RaceService } from '../../../services/firebase/race/race.service';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AbilityScoresNewComponent } from '../ability-scores-new/ability-scores-new.component';
import { User } from 'firebase';


@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.css']
})
export class NewCharacterComponent implements OnInit, AfterViewInit {

  public playerName: string;
  public characterName: string;
  public gender: string;
  public totalAbilityScores: AbilityScore;
  public playerHasRolledAllStats: boolean;
  public playerHasSelectedRace: boolean;
  public races: any;
  public typeAheadRace: any;
  public selectedRace: RaceId;
  public readyToPickClass: boolean;

  @ViewChild('popover') public popover: NgbPopover;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  @ViewChild(AbilityScoresNewComponent)
  private abilityScoresNewComponent: AbilityScoresNewComponent;

  private currentUser: User;

  constructor(private router: Router,
              private authService: AuthService,
              private characterService: CharacterService,
              private raceService: RaceService) {

    authService.user$.subscribe(user => {
      this.currentUser = user;
      this.playerName = this.currentUser.displayName;
      // console.log('NewCharacterComponent - user loaded: ', this.currentUser);
    });

    raceService.getRaces().subscribe(
      value => {
        // Set races from firebase db
        this.races = value;
        // Sort races by name
        this.races.sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        // Set default selectedRace as Human
        this.selectedRace = this.races.find(race => race.name === 'Human');
        this.abilityScoresNewComponent.selectedRace = this.selectedRace;
      },
      err => console.log('Error :: ' + err)
    );

  }

  ngOnInit() {
    if (this.authService.authenticated) {
      this.playerName = '';
      this.characterName = '';
      this.gender = 'Male';
      this.readyToPickClass = false;
      this.playerHasRolledAllStats = false;
      this.playerHasSelectedRace = false;
    } else {
      this.router.navigate( ['/login'] );
    }
  }


  ngAfterViewInit() {
  }


  formatMatches = (matchedValue: any) => matchedValue.name || '';
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (
          term === '' ? this.races : this.races.filter( v => v.name.toString().toLowerCase().indexOf( term.toLowerCase() ) > -1  )
        ).slice(0, 10)
      )
    );
  }
  setSelectedRace(selectedValue: any): void {
    // Set selected race and emit updates back to parent component
    this.selectedRace = this.races.find(race => race.name === selectedValue.name);
    this.abilityScoresNewComponent.selectedRace = this.selectedRace;
    this.playerHasSelectedRace = true;
    this.abilityScoresNewComponent.playerHasSelectedRace = this.playerHasSelectedRace;
    // update total ability scores
    this.abilityScoresNewComponent.updateTotalAbilityScores();
  }


  // TODO: Add names to Firestore
  generateRandomName(): void {
    const dwarfMaleNames = ['Adrik', 'Alberich', 'Baern', 'Barendd', 'Brottor', 'Bruenor', 'Dain', 'Darrak', 'Delg', 'Eberk',
      'Einkil', 'Fargrim', 'Flint', 'Gardain', 'Harbek', 'Kildrak', 'Morgran', 'Orsik', 'Oskar', 'Rangrim', 'Rurik', 'Taklinn',
      'Thoradin', 'Thorin', 'Tordek', 'Traubon', 'Travok', 'Ulfgar', 'Veit', 'Vondal'];
    const dwarfFemaleNames = ['Amber', 'Artin', 'Audhild', 'Bardryn', 'Dagnal', 'Diesa', 'Eldeth', 'Falkrunn', 'Finellen', 'Gunnloda',
      'Gurdis', 'Helja', 'Hlin', 'Kathra', 'Kristryd', 'Ilde', 'Liftrasa', 'Mardred', 'Riswynn', 'Sannl',
      'Torbera', 'Torgga', 'Vistra'];
    const dwarfClanNames = ['Balderk', 'Battlehammer', 'Brawnanvil', 'Dankil', 'Fireforge', 'Frostbeard', 'Gorunn', 'Holderhek',
      'Ironfist', 'Loderr', 'Lutgehr', 'Rumnaheim', 'Strakeln', 'Torunn', 'Ungart'];

    const elfMaleNames = ['Adran', 'Aelar', 'Aramil', 'Arannis', 'Aust', 'Beiro', 'Berrian', 'Carric', 'Enialis', 'Erdan', 'Erevan',
      'Galinndan', 'Hadarai', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Laucian', 'Mindartis', 'Paelias', 'Peren',
      'Quarion', 'Riardon', 'Rolen', 'Soveliss', 'Thamior', 'Tharivol', 'Theren', 'Varis'];
    const elfFemaleNames = ['Adrie', 'Althaea', 'Anastrianna', 'Andraste', 'Antinua', 'Bethrynna', 'Birel', 'Caelynn', 'Drusilia',
      'Enna', 'Felosial', 'Ielenia', 'Jelenneth', 'Keyleth', 'Leshanna', 'Lia', 'Meriele', 'Mialee', 'Naivara',
      'Quelenna', 'Quillathe', 'Sariel', 'Shanairra', 'Shava', 'Silaqui', 'Theirastra', 'Thia', 'Vadania',
      'Valanthe', 'Xanaphia'];
    const elfFamilyNames = ['Amakiir (Gemflower)', 'Amastacia (Starflower)', 'Galanodel (Moonwhisper)', 'Holimion (Diamonddew)',
      'Ilphelkiir (Gemblossom)', 'Liadon (Silverfrond)', 'Meliamne (Oakenheel)', 'Na??lo (Nightbreeze)',
      'Siannodel (Moonbrook)', 'Xiloscient (Goldpetal)'];

    const gnomeMaleNames = ['Alston', 'Alvyn', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Erky', 'Fonkin', 'Frug', 'Gerbo',
      'Gimble', 'Glim', 'Jebeddo', 'Kellen', 'Namfoodle', 'Orryn', 'Roondar', 'Seebo', 'Sindri', 'Warryn',
      'Wrenn', 'Zook'];
    const gnomeFemaleNames = ['Bimpnottin', 'Breena', 'Caramip', 'Carlin', 'Donella', 'Duvamil', 'Ella', 'Ellyjobell', 'Ellywick',
      'Lilli', 'Loopmottin', 'Lorilla', 'Mardnab', 'Nissa', 'Nyx', 'Oda', 'Orla', 'Roywyn', 'Shamil', 'Tana',
      'Waywocket', 'Zanna'];
    const gnomeClanNames = ['Beren', 'Daergel', 'Folkor', 'Garrick', 'Nackle', 'Murnig', 'Ningel', 'Raulnor', 'Scheppen', 'Timbers',
      'Turen'];

    const humanMaleNames = ['Adryan', 'Aksel', 'Andrey', 'Brahm', 'Danyel', 'Gabryel', 'Handus', 'Harold', 'Horgus', 'Yakob', 'Yosef',
      'Karlus', 'Lyam', 'Maks', 'Masyn', 'Miglus', 'Owyn', 'Ryn', 'Sebastyan', 'Teodus', 'Yesten'];
    const humanFemaleNames = ['Aleksa', 'Alyss', 'Bela', 'Brynn', 'Elyana', 'Feryia', 'Hazel', 'Katya', 'Lyna', 'Miya', 'Natalya', 'Rubi',
      'Sofi', 'Sosya', 'Tylla', 'Valentina', 'Vyla', 'Yanna', 'Yasmine'];
    const humanFamilyNames = ['Banks', 'Bridges', 'Brush', 'Butcher', 'Byrd', 'Feller', 'Greenland', 'Grove', 'Hurd', 'Lodges', 'Meadows',
      'Poleman', 'Pynes', 'Shepyrd', 'Shearer', 'Singer', 'Watters', 'Woodhouse', 'Woodyn', 'Wool'];

    const halfOrcMaleNames = ['Dench', 'Feng', 'Gell', 'Henk', 'Holg', 'Imsh', 'Keth', 'Krusk', 'Mhurren', 'Ront', 'Shump', 'Thokk'];
    const halfOrcFemaleNames = ['Baggi', 'Emen', 'Engong', 'Kansif', 'Myev', 'Neega', 'Ovak', 'Ownka', 'Shautha', 'Sutha', 'Vola', 'Volen',
                                'Yevelda'];

    const halflingMaleNames = ['Alton', 'Ander', 'Cade', 'Corrin', 'Eldon', 'Errich', 'Finnan', 'Garret', 'Lindal', 'Lyle', 'Merric',
                               'Milo', 'Osborn', 'Perrin', 'Reed', 'Roscoe', 'Wellby'];
    const halflingFemaleNames = ['Andry', 'Bree', 'Callie', 'Cora', 'Euphemia', 'Jillian', 'Kithri', 'Lavinia', 'Lidda', 'Merla', 'Nedda',
                                 'Paela', 'Portia', 'Seraphina', 'Shaena', 'Trym', 'Vani', 'Verna'];
    const halflingFamilyNames = ['Brushgather', 'Goodbarrel', 'Greenbottle', 'High-hill', 'Hilltopple', 'Leagallow', 'Tealeaf', 'Thorngage',
                                 'Tosscobble', 'Underbough'];

    const warforgedNames = ['Azm', 'Book', 'Bulwark', 'Cart', 'Charger', 'Cutter', 'Falchion', 'Graven', 'Hammer', 'Mark', 'Morg',
                            'Nameless', 'Pierce', 'Pious', 'Relic', 'Rune', 'Steeple', 'Sword', 'Three', 'Titan', 'Unsung', 'Victor',
                            'Watcher', 'Zealot', 'Mega Man', 'A.W.E.S.O.M-O', 'HK-47', 'ED-209', 'Bishop', 'Energizer', 'H.E.L.P.eR.',
                            'Clank', 'Johnny 5', 'Marvin the Paranoid Android', 'NXT', 'Optimus Prime', 'Roomba', 'Rosie', 'K-9',
                            'T-800/101/RIP', 'ASIMO', 'GLaDOS', 'HAL 9000', 'Data', 'R2D2', 'Bender Bending Rodriguez', 'Wall-E'];

    if (this.selectedRace !== undefined) {
      switch (this.selectedRace.name) {
        case 'Dwarf':
          switch (this.gender) {
            case 'Male': // Return Male Dwarf Name
              this.characterName = dwarfMaleNames[Math.floor(Math.random() * dwarfMaleNames.length)] + ' '
                + dwarfClanNames[Math.floor(Math.random() * dwarfClanNames.length)];
              break;
            case 'Female': // Return Female Dwarf Name
              this.characterName = dwarfFemaleNames[Math.floor(Math.random() * dwarfFemaleNames.length)] + ' '
                + dwarfClanNames[Math.floor(Math.random() * dwarfClanNames.length)];
              break;
          }
          break;
        case 'Elf':
          switch (this.gender) {
            case 'Male': // Return Male Elf Name
              this.characterName = elfMaleNames[Math.floor(Math.random() * elfMaleNames.length)] + ' '
                + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)];
              break;
            case 'Female': // Return Female Elf Name
              this.characterName = elfFemaleNames[Math.floor(Math.random() * elfFemaleNames.length)] + ' '
                + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)];
              break;
          }
          break;
        case 'Gnome':
          switch (this.gender) {
            case 'Male': // Return Male Gnome Name
              this.characterName = gnomeMaleNames[Math.floor(Math.random() * gnomeMaleNames.length)] + ' '
                + gnomeClanNames[Math.floor(Math.random() * gnomeClanNames.length)];
              break;
            case 'Female': // Return Female Gnome Name
              this.characterName = gnomeFemaleNames[Math.floor(Math.random() * gnomeFemaleNames.length)] + ' '
                + gnomeClanNames[Math.floor(Math.random() * gnomeClanNames.length)];
              break;
          }
          break;
        case 'Half-Elf':
          const halfElfMaleNames = [...elfMaleNames , ...humanMaleNames];
          const halfElfFemaleNames = [...elfFemaleNames , ...humanFemaleNames];
          const halfElfFamilyNames = [...elfFamilyNames , ...humanFamilyNames];
          switch (this.gender) {
            case 'Male': // Return Male Half-Elf Name
              this.characterName = halfElfMaleNames[Math.floor(Math.random() * halfElfMaleNames.length)] + ' '
                + halfElfFamilyNames[Math.floor(Math.random() * halfElfFamilyNames.length)];
              break;
            case 'Female': // Return Female Half-Elf Name
              this.characterName = halfElfFemaleNames[Math.floor(Math.random() * halfElfFemaleNames.length)] + ' '
                + halfElfFamilyNames[Math.floor(Math.random() * halfElfFamilyNames.length)];
              break;
          }
          break;
        case 'Half-Orc':
          switch (this.gender) {
            case 'Male': // Return Male Half-Orc Name
              this.characterName = halfOrcMaleNames[Math.floor(Math.random() * halfOrcMaleNames.length)];
              break;
            case 'Female': // Return Female Half-Orc Name
              this.characterName = halfOrcFemaleNames[Math.floor(Math.random() * halfOrcFemaleNames.length)];
              break;
          }
          break;
        case 'Halfling':
          switch (this.gender) {
            case 'Male': // Return Male Halfling Name
              this.characterName = halflingMaleNames[Math.floor(Math.random() * halflingMaleNames.length)] + ' '
                + halflingFamilyNames[Math.floor(Math.random() * halflingFamilyNames.length)];
              break;
            case 'Female': // Return Female Halfling Name
              this.characterName = halflingFemaleNames[Math.floor(Math.random() * halflingFemaleNames.length)] + ' '
                + halflingFamilyNames[Math.floor(Math.random() * halflingFamilyNames.length)];
              break;
          }
          break;
        case 'Human':
          switch (this.gender) {
            case 'Male': // Return Male Human Name
              this.characterName = humanMaleNames[Math.floor(Math.random() * humanMaleNames.length)] + ' '
                + humanFamilyNames[Math.floor(Math.random() * humanFamilyNames.length)];
              break;
            case 'Female': // Return Female Human Name
              this.characterName = humanFemaleNames[Math.floor(Math.random() * humanFemaleNames.length)] + ' '
                + humanFamilyNames[Math.floor(Math.random() * humanFamilyNames.length)];
              break;
          }
          break;
        case 'Warforged':
          this.characterName = warforgedNames[Math.floor(Math.random() * warforgedNames.length)];
          break;
        default:
          this.characterName = 'Geoff';
          break;
      }
    } else {
      this.characterName = 'Geoff';
    }
    this.checkPlayerIsReadyToPickClass();
  }

  radioBtnMale(): void {
    this.gender = 'Male';
  }

  radioBtnFemale(): void {
    this.gender = 'Female';
  }

  checkPlayerIsReadyToPickClass(): void {
    if ( this.playerName.length >= 1 && this.characterName.length >= 1
      && this.gender && this.playerHasSelectedRace && this.playerHasRolledAllStats ) {
      this.readyToPickClass = true;
    } else {
      this.readyToPickClass = false;
    }
  }

  playerHasRolledAllStatsChanged(playerHasRolledAllStats: boolean) {
    this.playerHasRolledAllStats = playerHasRolledAllStats;
  }

  totalAbilityScoresChangedHandler(totalAbilityScores: AbilityScore) {
    this.totalAbilityScores = totalAbilityScores;
    this.checkPlayerIsReadyToPickClass();
  }

  selectCharacterClass() {
    if (this.readyToPickClass) {
      this.characterService.newCharacter();
      this.characterService.tempCharacter.owner = this.currentUser.uid;
      this.characterService.tempCharacter.playerName = this.playerName;
      this.characterService.tempCharacter.characterName = this.characterName;
      this.characterService.tempCharacter.gender = this.gender;
      this.characterService.tempCharacter.height = generateNewRandomHeight(this.selectedRace, this.gender);
      this.characterService.tempCharacter.weight = generateNewRandomWeight(this.selectedRace, this.gender);
      this.characterService.tempCharacter.totalAbilityScores = this.totalAbilityScores;
      this.characterService.tempCharacter.raceId = this.selectedRace.id;
      this.characterService.tempCharacter.size = this.selectedRace.size;
      this.characterService.tempCharacter.ecl = 1 + this.selectedRace.levelAdjustment;
      this.router.navigate( ['/character/new/class'] );
    } else {
      this.popover.open();
    }
  }

}
