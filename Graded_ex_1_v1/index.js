const prompts = require('prompts');


class Room {
  constructor(name, description,exitRoom) {
      this.name = name;
      this.description = description;
      this.exitRoom = exitRoom;
      this.linkedRooms = [];
      this.characterPresent = [];
  }
  describe() {
      return this.description;
  }
  linkRoom(linkedRoom) {
      this.linkedRooms.push(linkedRoom);
      return this;
  }
  addCharacter(character) {
    this.characterPresent.push(character);
    return this;
  }
  
  roomLocation() {
      return `${player.name} is in the ${this.name}.`
  }
  
}

class Characters {
  constructor(name, desc, health, damage, hit_chances) {
      this.name = name;
      this.desc = desc;
      this.health = health;
      this.damage = damage;
      this.hit_chances = hit_chances;
  }
   
  describe() {
       return `${this.name} ${this.desc}, has ${this.health} health points, ${this.damage} damage points, and ${this.hit_chances} hit chances.`
  }
   
  characterAttack(player) {
     console.log( `The ${this.name} attacks ${player.name}!`);
     let random_number = Math.floor(Math.random()*100); // generate random number between 0 and 100
      if (random_number <= this.hit_chances) {
        player.health -= this.damage;
        console.log(`${this.name} hits ${player.name} for ${this.damage} damage!`);
        console.log(`${player.name} has ${player.health} health points left.`);
      } else {
        console.log(`${this.name} missed.${player.name} is safe and still has ${player.health} health points left.`);
      }
      if(player.health <= 0) {
        console.log(`${player.name} has died a glorious death !`);
        console.log(`Please try the adventure again later.`);
        process.exit();
      }
    }
}

class Player extends Characters{
  constructor(name, desc, health, damage, hit_chances) {
      super(name, desc, health, damage, hit_chances);
  }

playerAttack(enemy) {
    console.log( `The ${this.name} attacked ${enemy.name}!`);
    let random_number = Math.floor(Math.random()*100); // generate random number between 0 and 100
     if (random_number <= this.hit_chances) {
       enemy.health -= this.damage;
       console.log(`${this.name} hit ${enemy.name} for ${this.damage} damages!`);
       console.log(`${enemy.name} has ${enemy.health} health left.`);
     } else {
       console.log(`${this.name} missed.Try again.`);
     }
     if(enemy.health <= 0) {
       console.log(`${enemy.name} has died!`);
       for(let i = 0; i < rooms[currentRoom].characterPresent.length; i++) {
         if(rooms[currentRoom].characterPresent.includes(enemy)) {
           rooms[currentRoom].characterPresent.splice(i, 1);
         }
       }
    }
  }

   playerMove(room){
      this.currentRoom = rooms.indexOf(room);
      if(rooms[this.currentRoom].exitRoom === true) {
        console.log(`${this.name} have escaped the dungeon!`);
        process.exit();
      }
      for(let i = 0; i < rooms[this.currentRoom].characterPresent.length; i++) {
        if(rooms[this.currentRoom].characterPresent.length>0) {
          rooms[this.currentRoom].characterPresent[i].characterAttack(this);
        }
      }
    }
    

    playerLook() {
      console.log(`${this.name} is in the ${rooms[currentRoom].name}`);
        console.log( `${rooms[currentRoom].describe()}`);
      if(rooms[currentRoom].characterPresent.length == 0) {
        console.log(`There is no enemy in the ${rooms[currentRoom].name}.`);
      } 
      else if(rooms[currentRoom].characterPresent.length>0) {
          for(let i=0; i < rooms[currentRoom].characterPresent.length; i++) {
          console.log(`${rooms[currentRoom].characterPresent[i].name} is here.`);
          rooms[currentRoom].characterPresent[i].characterAttack(this);

      }
    }

  }
}


let entrance = new Room("Entrance", "It is a dark and damp room",false);
let hallway = new Room("Hallway", " It is a long dark hallway..",false);
let chamber = new Room("Chamber", "It is a small smelly champer.",false);
let portal = new Room("Portal", " It is completely darkness.",true);

entrance.linkRoom(hallway);
hallway.linkRoom(entrance);
hallway.linkRoom(chamber);
chamber.linkRoom(hallway);
chamber.linkRoom(portal);
portal.linkRoom(chamber);

let rat = new Characters('Sewer Rat', 'He is a black hairy giant rat. His eyes are red and his teeth are sharp.', 2,1,50);
let dragon = new Characters('Giant Dragon', 'He has sharp clowns and fire breath', 4,8,90);

hallway.addCharacter(rat);
chamber.addCharacter(dragon);

let player = new Player('Brave Heart','is a human', 10,2,75);

let currentRoom = 0;                           // start the game in the entrance
let rooms =[entrance,hallway,chamber,portal];






async function gameLoop() {

     let continueGame = true;


    const initialActionChoices = [
        { title: 'Look around', value: 'look' },
        { title: 'Go to Room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack'},
        { title: 'Exit game', value: 'exit'}
    ];

   
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });
    
    switch (response.value) {
      case 'look':
        player.playerLook();
        break;
      
      case 'goToRoom':
       let roomSelection = [];
        for(let i = 0; i < rooms[currentRoom].linkedRooms.length; i++) {
            roomSelection.push({
                title: rooms[currentRoom].linkedRooms[i].name,
                value: rooms[currentRoom].linkedRooms[i].name,
                room: rooms[currentRoom].linkedRooms[i]
            });

            }
        const response = await prompts({
          type: 'select',
          name: 'value',
          message: 'Which room do you want to go to?',
          choices: roomSelection
        });
        for(let i = 0; i < roomSelection.length; i++) {
            if(response.value === roomSelection[i].value) {
                currentRoom = rooms.indexOf(roomSelection[i].room);
                console.log(roomSelection[i].room.roomLocation());
                player.playerMove(roomSelection[i].room);
                break;
            }
        }
        break;
      
      case 'attack':
        if(rooms[currentRoom].characterPresent.length == 0) {
          console.log(`There is no enemy here in the ${ rooms[currentRoom].name} for attacking. Try another room.`);
          break;
        }
        let enemySelection = [];
        for(let i = 0; i < rooms[currentRoom].characterPresent.length; i++) {
            enemySelection.push({
                title: rooms[currentRoom].characterPresent[i].name,
                value: rooms[currentRoom].characterPresent[i].name,
                enemy: rooms[currentRoom].characterPresent[i]
            });
        }
        const attackResponse = await prompts({  
          type: 'select',
          name: 'value',
          message: 'Which enemy do you want to attack?',
          choices: enemySelection
        });
        
        for(let i = 0; i < enemySelection.length; i++) {
            if(attackResponse.value === enemySelection[i].value) {
                player.playerAttack(enemySelection[i].enemy);
              } 
            }
        break;  

      case 'exit':
        console.log('You exit the adventure. See you next time.');
        continueGame = false;
        break;
    }
    if(continueGame) {
    gameLoop();
    }
}

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log(player.describe());
console.log(`${player.name} walks down the stairs to the dungeons`)
gameLoop();


