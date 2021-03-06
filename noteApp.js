var readline = require('readline')
var firebase = require('firebase');
var colors = require('colors') // npm install colors
  , rl = readline.createInterface(process.stdin, process.stdout, completer)

  , help = [ '.help        ' + 'display this message.'.grey
           , '.error       ' + 'display an example error'.grey
           , '.q[uit]      ' + 'exit console.'.grey
           ].join('\n')
  ;


//creating Database if not existing
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var stmt;


//Connect to Database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
//Database Serialization
db.serialize(function(){
  if(!exists){
    db.run("CREATE TABLE noteApp (content TEXT)");
  }

stmt = db.prepare("INSERT INTO noteApp VALUES (?)");


});

//Creating an instance to SQliteToJson
const SqliteToJson = require('sqlite-to-json');
const exporter = new SqliteToJson({
  client: new sqlite3.Database('./test.db')
});


function completer(line) {
  var completions = '.help .error .exit .quit .q'.split(' ')
  var hits = completions.filter(function(c) {
    if (c.indexOf(line) == 0) {
      return c;
    }
  });
  return [hits && hits.length ? hits : completions, line];
}

function welcome() {
  console.log([ "= NOTE TAKING APPLICATION"
            , "= Welcome, enter .help if you're lost."
            , "= Enter 1 to Create Note"
            , "= Enter 2 to List Note"
            , "= Enter 3 to Delete Note"
            , "= Enter 4 to View Note"
            , "= Enter 5 to Search Note"
            , "= Enter 6 to Export Note to JSON"
            , "= Enter 7 to Sync Note Online"
            , "= Enter .q to quit Application"
            ].join('\n').blue);
  prompt();
}

function prompt() {
  var arrow    = '> '
    , length = arrow.length
    ;

  rl.setPrompt(arrow.grey, length);
  rl.prompt();
}

function toJson(){

  exporter.save('noteApp', './data/noteApp.json', function(err){
        //Print out update
      });
}
 

function exec(command) {
  var num = parseInt(command, 10);
    if(1 <= num && num <= 7) {
      if (num === 1) {
        console.log("Create Note");
            rl.question("Create Note :" + '\n', function(note_content){
                  if(note_content){
                        var newNote = note_content;
                        stmt.run(" " + newNote);
                        console.log("Note Created!".green);
                  }
                  else if (!note_content){
                        console.log("Please Enter '1' again and write a note");
                  }

            })


      }

      //List All Note

      else if (num === 2){
            
            var page = 1;
            var perPage = 5;

            function showRow(page) {
              console.log(page, " --> Page");
              var offset = (page - 1) * perPage;
              db.each("SELECT rowid AS id, content FROM noteApp LIMIT " + perPage + " OFFSET " + offset, function(err, row) {
                console.log(row.id + " : " + row.content);
              });
            }

            showRow(page);

            console.log("NEXT? (Y/N): "+ '/n');
            rl.question("NEXT? (Y/N): ", function(ans) {
              if(ans === "Y" ||"y"){
                showRow(page+=1);
              } else {
                console.log("Thanks");
              }
            });
      }

      else if (num === 3){
        console.log('Enter the Note number you want to Delete :');
        rl.question('Enter the Note number you want to Delete :' + '\n', function(note_id){
          note_id = parseInt(note_id);
          if (note_id){
            db.each("DELETE FROM noteApp WHERE rowid = " + note_id, function(err, row){
              console.log("NOTE DELETED ----" );
            });

            console.log("NOTE DELETED ----" );
          }
            else if(!note_id){
              console.log ("Note does not Exist!!!".red);
            }
            
          
        })        
      }


      //View Notes based on inputs and if available in DB
      else if (num === 4){
        console.log("Enter the Note number you want to view :");
        rl.question('Enter the Note number you want to view :' + '\n', function(note_id){
          note_id = parseInt(note_id);
          if (note_id){
            db.each("SELECT rowid AS id, content FROM noteApp WHERE rowid = " + note_id, function(err, row){
              console.log("content: " + row.id + row.content);
            });
          }

          else if(!note_id){
                        console.log("Please Enter '2' again and write a note");
                  }
        }) 
      }





      else if (num === 5){
        console.log('Type in the word to search'.yellow);
        rl.question('Type in the word to search:'.yellow + '\n', function(query_string){
          if (query_string){
            db.each("SELECT content FROM noteApp WHERE content LIKE '%" + query_string +"%'", function(err, row){
              console.log("Content : " + row.content);
            });
          }
        })
      }     

 
    if (num === 6) {
      toJson();
      console.log("Notes Exported" +'\n'+ "Check data folder to view your JSON file!!!" .green);
    }


    if (num === 7) {
      //Initializing Firebase
      var config = {
        apiKey: "AIzaSyC8B7I3055iWo2z5OOI0zBUmWSBR7-_vYQ",
        authDomain: "noteapp-f0b6e.firebaseapp.com",
        databaseURL: "https://noteapp-f0b6e.firebaseio.com",
        storageBucket: "noteapp-f0b6e.appspot.com",
        messagingSenderId: "904823682997"
      };
      firebase.initializeApp(config);

      //Referencing to Firebase Database Service

      toJson();
      firebase.database().ref('NoteApp/').push(JSON.parse(fs.readFileSync('./data/noteApp.json').toString()));
      console.log ("Note Updated".green);
    }


  } else if (command[0] === '.') {
  
    switch (command.slice(1)) {
      case 'help':
        console.log(help.yellow);
        break;
      case 'error':
        console.log("Here's what an error might look like");
        JSON.parse('{ a: "bad JSON" }');
        break;
      case 'exit':
      case 'quit':
      case 'q':
        process.exit(0);
        break;
    }
  } else {
    // only print if they typed something
    if (command !== '') {
      console.log(('\'' + command 
                  + '\' Invalid Input').red);
    }
  }
  prompt();
}


// 
// Set things up
//
rl.on('line', function(cmd) {
  exec(cmd.trim());
}).on('close', function() {
  // only gets triggered by ^C or ^D
  console.log('goodbye!'.green);
  process.exit(0);
});

process.on('uncaughtException', function(e) {
  console.log(e.stack.red);
  rl.prompt();
});

welcome();


// Make sure the buffer is flushed before displaying prompt
function flush(callback) {
  if (process.stdout.write('')) {
    callback();
  } else {
    process.stdout.once('drain', function() {
      callback();
    });
  }
};