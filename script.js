let cardsData = [
  {
    title: "Long Walk to Freedom",
    author: "Nelson Mandela",
    date: "1994",
    type: "Biography",
    tags: ["History"],
    available: true,
    quote: "I have discovered the secret that after climbing a great hill, one only finds that there are many more hills to climb. I have taken a moment here to rest, to steal a view of the glorious vista that surrounds me, to look back on the distance I have come. But I can only rest for a moment, for with freedom come responsibilities, and I dare not linger, for my long walk is not ended.",
    totalPages: 1243,
    readPages: 1243
  },
  {
    title: "The Autobiography of Benjamin Franklin",
    author: "Benjamin Franklin",
    date: "1706",
    type: "Biography",
    tags: ["History"],
    available: true,
    quote: "hello",
    totalPages: 350,
    readPages: 100
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    date: "1946",
    type: "Nonfiction",
    tags: [],
    available: true,
    quote: "",
    totalPages: 165,
    readPages: 165
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    date: "2003",
    type: "Fiction",
    tags: ["Mystery"],
    available: true,
    quote: "",
    totalPages: 480,
    readPages: 480
  },
  {
    title: "The Monk Who Sold His Ferrari: A Fable About Fulfilling Your Dreams and Reaching Your Destiny",
    author: "Robin Sharma",
    date: "1996",
    type: "Self Help",
    tags: [],
    available: true,
    quote: "",
    totalPages: 208,
    readPages: 208
  },
  {
    title: "The Gods Themselves",
    author: "Isaac Asimov,",
    date: "1966 ",
    type: "Science Fiction",
    tags: [],
    available: true,
    quote: "",
    totalPages: 288,
    readPages: 288
  },
  {
    title: "Mahatma Gandhi Autobiography: The Story Of My Experiments With Truth",
    author: "M.K. Gandhi",
    date: "2020",
    type: "Biography",
    tags: [],
    available: true,
    quote: "",
    totalPages: 649,
    readPages: 649
  }
];

//================================================================
// variables and objects =========================================
//================================================================
const cardsContainer = document.getElementById('cardsContainer');
const cardForm = document.getElementById('cardForm');
const hideFormBtn = document.getElementById('hideFormBtn');
const hideForm = document.getElementById('hideForm');
const submitBtn = document.getElementById('submitBtn');
let editingCardIndex = null;  
//=======================================================================
// Functions ============================================================
//=======================================================================

function calculateCompletion(read, total) {
  if (total <= 0) return 0;
  const percent = Math.round((read / total) * 100);
  return percent;
}

function rearrangeCards() {
  cardsContainer.innerHTML = '';
  if (cardsData.length === 0) {
    cardsContainer.innerHTML = '<p class="empty-state">No books available. Create one above!</p>';
    return;
  }

  cardsData.forEach((card, index) => {          
    let tagsHTML = '';
    tagsHTML += card.available
      ? `<span class="tag tag-available">Available</span>`
      : `<span class="tag tag-not-available">Not Available</span>`;

    const displayedTags = card.tags.slice(0, 3); //strings
    const remainingCount = card.tags.length - 3; //number

    tagsHTML += displayedTags.map(tag => `<span class="tag">${tag}</span>`).join('');

    if (remainingCount > 0) {
      tagsHTML += `<span class="tag tag-count">+${remainingCount}</span>`;
    }

    const completionPercent = calculateCompletion(card.readPages, card.totalPages);
    const completionText = completionPercent === 100 ? "Completed" : `Completion: ${completionPercent}%`;
    const quoteHTML = card.quote ? `<div class="quote-container" title="${card.quote.replace(/"/g, '&quot;')}">"${card.quote}"</div>` : '';

    const cardHTML = `
      <div class="card">
        <div class="card-header">
          <h1 class="card-title">${card.title}</h1>
          <div class="header-actions">
            <span class="badge">${card.type}</span>
          </div>
        </div>
        <hr class="divider">
        <div class="metadata">
          <p class="author-date">${card.author} &middot; ${card.date}</p>
          <div class="completion-info">
            <span class="${completionPercent === 100 ? 'percent' : ''}">${completionText}</span>
          </div>
        </div>
        ${quoteHTML}
        <div class="tags-container">${tagsHTML}</div>

        <div class="options-menu" id="menu-${index}">
          <button class="menu-toggle-btn" onclick="toggleMenu(${index}, event)">&#8942;</button>
          <div class="dropdown">
            <button class="dropdown-item" onclick="editCard(${index})">Edit Book</button>
            <button class="dropdown-item delete" onclick="deleteCard(${index})">Delete</button>
          </div>
        </div>
      </div>
    `;
    cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
  });
}

//The three dots menue
function toggleMenu(index, event) {
  event.stopPropagation();
  const currentMenu = document.getElementById(`menu-${index}`);

  document.querySelectorAll('.options-menu').forEach(menu => {
    if (menu !== currentMenu) menu.classList.remove('active');
  });

  currentMenu.classList.toggle('active');
}

function editCard(index) {
  const cardToEdit = cardsData[index];
  if (!cardToEdit) return;

  document.getElementById('title').value = cardToEdit.title;
  document.getElementById('author').value = cardToEdit.author;
  document.getElementById('date').value = cardToEdit.date;
  document.getElementById('type').value = cardToEdit.type;
  document.getElementById('totalPages').value = cardToEdit.totalPages || '';
  document.getElementById('readPages').value = cardToEdit.readPages || '';
  document.getElementById('available').checked = cardToEdit.available;
  document.getElementById('tags').value = cardToEdit.tags.join(', ');
  document.getElementById('quote').value = cardToEdit.quote || '';

  editingCardIndex = index;                 
  submitBtn.textContent = 'Update Book';
  hideForm.classList.remove('hidden');
  hideFormBtn.textContent = `+ Close Form`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addBook(cardData) {
  cardsData.push(cardData);                
  rearrangeCards();
}

function deleteCard(index) {
  cardsData.splice(index, 1);               
  rearrangeCards();
}

function updateBook(index, newData) {
  if (cardsData[index]) {
    cardsData[index] = { ...cardsData[index], ...newData };
    rearrangeCards();
  }
}
//===============================================================
//Event Handelers ===============================================
//===============================================================

document.addEventListener('click', () => {
  document.querySelectorAll('.options-menu').forEach(menu => {
    menu.classList.remove('active');
  });
});

hideFormBtn.addEventListener('click', () => {
  const hiddenForm = hideForm.classList.toggle('hidden');
  if (hiddenForm) {
    hideFormBtn.textContent = `+ Add New Book`;
    cardForm.reset();
    editingCardIndex = null;                // ← reset flag
    submitBtn.textContent = 'Create Book';
  } else {
    hideFormBtn.textContent = `+ Close Form`;
  }
});

cardForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const totalPages = parseInt(document.getElementById('totalPages').value) || 0;
  const readPages = parseInt(document.getElementById('readPages').value) || 0;
  const errorSpan = document.getElementById('pagesError');
  const readPagesInput = document.getElementById('readPages');
  const tagsInput = document.getElementById('tags').value;
  // This is the book data for new book or editing 
  const cardData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    date: document.getElementById('date').value,
    type: document.getElementById('type').value,
    tags: tagsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
    available: document.getElementById('available').checked,
    quote: document.getElementById('quote').value,
    totalPages: totalPages,
    readPages: readPages
  };

  if (readPages > totalPages) {
    errorSpan.style.display = 'block';
    readPagesInput.classList.add('input-error');
    return;
  } else {
    errorSpan.style.display = 'none';
    readPagesInput.classList.remove('input-error');
  }

  // editingCardIndex is 0 for the first card — use !== null, not truthiness!
  if (editingCardIndex !== null) {
    updateBook(editingCardIndex, cardData);
  } else {
    addBook(cardData);
  }

  // Reset UI
  cardForm.reset();
  editingCardIndex = null;
  submitBtn.textContent = 'Create Book';
  hideForm.classList.add('hidden');
  hideFormBtn.innerHTML = `+ Add New Book`;
});

rearrangeCards();