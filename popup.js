document.addEventListener('DOMContentLoaded', function() {
    const noteInput = document.getElementById('note-input');
    const addBtn = document.getElementById('add-btn');
    const notesList = document.getElementById('notes-list');
  
    // Load notes from local storage
    loadNotes();
  
    addBtn.addEventListener('click', function() {
      const noteText = noteInput.value.trim();
      if (noteText) {
        addNote(noteText);
        noteInput.value = '';
      }
    });
  
    function loadNotes() {
      chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        notesList.innerHTML = '';
        notes.forEach((note, index) => renderNote(note, index));
      });
    }
  
    function addNote(text) {
      chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        notes.push({ text, favorite: false });
        chrome.storage.local.set({ notes }, loadNotes);
      });
    }
  
    function deleteNote(index) {
      chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        notes.splice(index, 1);
        chrome.storage.local.set({ notes }, loadNotes);
      });
    }
  
    function toggleFavorite(index) {
      chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        notes[index].favorite = !notes[index].favorite;
        chrome.storage.local.set({ notes }, loadNotes);
      });
    }
  
    function renderNote(note, index) {
        const li = document.createElement('li');
      
        // Create and format the current time
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
         
        });
      
        // Create a container for the note text and timestamp
        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
      
        const noteText = document.createElement('span');
        noteText.textContent = note.text;
        noteText.className = 'note-text';
      
        const timeStamp = document.createElement('span');
        timeStamp.textContent = ` (${timeString})`;
        timeStamp.className = 'note-time';
      
        noteContent.appendChild(noteText);
        noteContent.appendChild(timeStamp);
      
        // Create the star icon
        const starIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starIcon.setAttribute('viewBox', '0 0 24 24');
        starIcon.setAttribute('width', '24');
        starIcon.setAttribute('height', '24');
        starIcon.setAttribute('class', 'star-icon');
      
        const starPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        starPath.setAttribute('d', 'M12 2.5l2.57 7.91h8.33l-6.7 4.88 2.57 7.91-6.7-4.88-6.7 4.88 2.57-7.91-6.7-4.88h8.33z');
        starPath.setAttribute('fill', note.favorite ? 'gold' : 'none');
        starPath.setAttribute('stroke', 'gray');
        starPath.setAttribute('stroke-width', '2');
      
        starIcon.appendChild(starPath);
        starIcon.addEventListener('click', function() {
          toggleFavorite(index);
        });
      
        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
          deleteNote(index);
        });
      
        // Create a container for actions
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.appendChild(starIcon);
        actions.appendChild(deleteBtn);
      
        // Append note content and actions to list item
        li.appendChild(noteContent);
        li.appendChild(actions);
      
        notesList.appendChild(li);
      }
      
    // Set current date in header
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    document.getElementById('date-header').textContent = formattedDate;
});
