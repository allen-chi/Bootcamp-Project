var readline = require ('readline');
var colors = require('colors');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
var newNote = [];



rl.prompt();
	rl.question(" NOTE TAKING APPLICATION" + '\n' +
            " Welcome, enter .help if you're lost." + '\n' +
            " Enter 1 to Create Note" + '\n' +
            " Enter 2 to View Note" + '\n' +
            " Enter 3 to Delete Note" + '\n' +
            " Enter 4 to List Note" + '\n' +
            " Enter 5 to Search Note" + '\n', function(num){
            	var newNum = parseInt(num,10);
            	if(num == 1){
            			rl.question('Create Note :' + '\n', function(note_content){
            				//TODO: Log answer in DB
            				
            				if(note_content){
            					newNote = note_content;
            					console.log('Note Created');
            				}
            				else if(!note_content){
            					console.log("Please type in contents");
            				}
            			num++;
            			})
            		}
    })

