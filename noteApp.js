var readline = require('readline')
  , util = require('util')
  , colors = require('colors') // npm install colors
  , rl = readline.createInterface(process.stdin, process.stdout, completer)

  , help = [ '.help        ' + 'display this message.'.grey
           , '.error       ' + 'display an example error'.grey
           , '.q[uit]      ' + 'exit console.'.grey
           ].join('\n')
  ;

var stmt;
//creating Database if not existing
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

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


function completer(line) {
  var completions = '.help .error .exit .quit .q'.split(' ')
  var hits = completions.filter(function(c) {
    if (c.indexOf(line) == 0) {
      // console.log('bang! ' + c);
      return c;
    }
  });
  return [hits && hits.length ? hits : completions, line];
}

function welcome() {
  console.log([ "= NOTE TAKING APPLICATION"
            , "= Welcome, enter .help if you're lost."
            , "= Enter 1 to Create Note"
            , "= Enter 2 to View Note"
            , "= Enter 3 to Delete Note"
            , "= Enter 4 to List Note"
            , "= Enter 5 to Search Note"
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


var newNote;


function exec(command) {
  var num = parseInt(command, 10);
  console.log(command);
  if(1 <= num && num <= 5) {
      if (num == 1) {
        console.log("Create Note");
            rl.question("Create Note :" + '\n', function(note_content){
                  if(note_content){
                        newNote = note_content;
                        stmt.run(" " + newNote);
                        stmt.finalize();
                        console.log("Note Created! Press Enter to choose an Option".green);
                  }
                  else if (!note_content){
                        console.log("Please Enter '1' again and write a note");
                  }

            })


      }

      //view Note

      else if (num === 2){
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
          //else {
            //  console.log ("Note does not Exist!!!".red);
            //}
            
          
        })            

      }

      else if (num === 3){
        rl.question('Enter the Note number you want to Delete :' + '\n', function(note_id){
          if (note_id){
            db.each("DELETE FROM noteApp WHERE rowid = " + note_id, function(err, row){
              console.log("NOTE DELETED ----" );
            });
          }
            else if(!note_id){
              console.log ("Note does not Exist!!!".red);
            }
            
          
        })        
      }

      else if (num === 4){
            db.each("SELECT rowid AS id, content FROM noteApp", function(err, row){
              console.log(row.id +" : "+row.content);
            });
              
            
            
      }

      else if (num === 5){
            console.log("5");
      }     

 
    /*if (num === 6) {
      console.log('WOW YOU ROCKS A LOT!'.rainbow);
      process.exit(0);
    }
    */

  } else if (command[0] === '.') {
  
    switch (command.slice(1)) {
      case 'help':
        util.puts(help.yellow);
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
  util.puts('goodbye!'.green);
  process.exit(0);
});

process.on('uncaughtException', function(e) {
  util.puts(e.stack.red);
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