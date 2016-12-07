var readline = require('readline')
  , util = require('util')
  , colors = require('colors') // npm install colors
  , rl = readline.createInterface(process.stdin, process.stdout, completer)

  , help = [ '.help        ' + 'display this message.'.grey
           , '.error       ' + 'display an example error'.grey
           , '.q[uit]      ' + 'exit console.'.grey
           ].join('\n')
  ;

// This should work now, thanks to @josher19
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
            ].join('\n').grey);
  prompt();
}

function prompt() {
  var arrow    = '> '
    , length = arrow.length
    ;

  rl.setPrompt(arrow.grey, length);
  rl.prompt();
}

//var state = 1;
var newNote;
function exec(command) {
  var num = parseInt(command, 10);
  if(1 <= num && num <= 5) {
      if (num === 1) {
            rl.question('Create Note :' + '\n', function(note_content){
                  if(note_content){
                        newNote = note_content;
                        console.log("Note Created".green);
                  }
                  else if (!note_content){
                        console.log("Please Enter '1' again and write a note");
                  }
            })

      }

      else if (num === 2){
            console.log(newNote);
      }

      else if (num === 3){
            console.log("3");
      }

      else if (num === 4){
            console.log("4");
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