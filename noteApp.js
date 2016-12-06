const readline = require ('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});


rl.prompt();
//rl.write('Note Writing Application allows you Create, View, Delete and List Notes');


//To Create Note
rl.question('Create Note :' + '\n', function(content) {
//TODO: Log answer in a Database
var newNote = "";
if (content){
	newNote = content;
}
console.log('Note Created: ' + '\n' + content);


rl.close();
})



/*

var i = rl.createInterface(process.stdin, process.stdout, null);
i.("Create Note", function(answer){
	i.on('line', (input) => {
	console.log('Note Created: $(input)');	
	})
	


//closing the app after a reply
	i.close();
	process.stdin.destroy();
})


class NoteApp{

	    var constructor = function(author){
		this.name = author;
		this.note =[];
	}


	create (note_content){
		var newNote = new Note(id, name, note_content);
		return this.note.push(newNote.note);
	}
}


*/