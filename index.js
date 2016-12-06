#! /usr/bin/env node

const rl = require ('readline');

var i = rl.createInterface(process.stdin, process.stdout, null);
i.question("What do want? ", function(answer){
	console.log("Thank you for wanting " + answer);


//closing the app after a reply
	i.close();
	process.stdin.destroy();
})


class NoteApp{

	    constructor (author){
		this.name = author;
		this.note =[];
	}


	create (note_content){
		var newNote = new Note(id, name, note_content);
		return this.note.push(newNote.note);
	}
}


