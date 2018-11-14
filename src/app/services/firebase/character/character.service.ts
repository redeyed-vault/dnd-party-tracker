import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Character, CharacterId} from '../../../models/character/character';
import {Alignment} from '../../../enums/enum-alignment';
import {Size} from '../../../enums/enum-size';
import {AbilityScore} from '../../../models/character/ability-scores';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private characterCollection: AngularFirestoreCollection<Character>;
  private characters: CharacterId[];
  public tempCharacter: Character;

  constructor(public db: AngularFirestore) {
    this.characterCollection = db.collection<Character>('/characters');
    this.getCharacters().subscribe(data => {
      this.characters = data;
    });
    this.tempCharacter = {
      owner: null,
      characterName: null,
      playerName: null,
      classes: null,
      ecl: null,
      raceId: null,
      size: null,
      imageUrl: null,
      gender: null,
      alignment: null,
      religion: null,
      height: null, // 5' 10"
      weight: null, // 220 lbs.
      looks: null,
      baseAbilityScores: new AbilityScore(0, 0, 0, 0,  0, 0),
      hitPoints: null,
      hitDie: null,
      baseAttackBonus: null,
      weaponsId: null,
      inventoryId: null,
    };
  }

  getCharacters(): Observable<CharacterId[]> {
    return this.characterCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as Character;
        return { id, ...data };
      }))
    );
  }

}
