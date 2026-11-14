let cardsData = [
  {
    id: "1",
    title: "Long Walk to Freedom",
    author: "Nelson Mandela",
    date: "1994",
    type: "Biography",
    tags: ["History"],
    available: true,
    quote: "He who saw the deep, the country's foundation, who knew the ways, was wise in all matters.",
    totalPages: 1243,
    readPages: 1243
  }
];

const cardsContainer = document.getElementById('cardsContainer');
const cardForm = document.getElementById('cardForm');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const formWrapper = document.getElementById('formWrapper');

const formBtnHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  Add New Book
`;

const closeBtnHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  Close Form
`;

toggleFormBtn.addEventListener('click', () => {
  formWrapper.classList.toggle('hidden');
  toggleFormBtn.innerHTML = formWrapper.classList.contains('hidden') ? formBtnHTML : closeBtnHTML;
});

function getTypeClass(type) {
    if (type === 'Poem') return 'type-poem';
    if (type === 'Myth/Legend') return 'type-myth';
    if (type === 'Scripture') return 'type-scripture';
    return 'type-other';
}

function getBadgeClass(type) {
    if (type === 'Poem') return 'badge-poem';
    if (type === 'Myth/Legend') return 'badge-myth';
    if (type === 'Scripture') return 'badge-scripture';
    return 'badge-other';
}

function calculateCompletion(read, total) {
    if (!total || total <= 0) return 0;
    const percent = Math.round((read / total) * 100);
    return Math.min(Math.max(percent, 0), 100);
}

function renderCards() {
  cardsContainer.innerHTML = '';

  if (cardsData.length === 0) {
    cardsContainer.innerHTML = '<p class="empty-state">No cards available. Create one above!</p>';
    return;
  }

  cardsData.forEach(card => {
    let tagsHTML = '';
    
    if (card.available) {
      tagsHTML += `<span class="tag tag-available">Available</span>`;
    } else {
      tagsHTML += `<span class="tag tag-not-available">Not Available</span>`;
    }

    const displayedTags = card.tags.slice(0, 3);
    const remainingCount = card.tags.length - 3;
    
    tagsHTML += displayedTags.map(tag => `<span class="tag">${tag}</span>`).join('');

    if (remainingCount > 0) {
      tagsHTML += `<span class="tag tag-count">+${remainingCount}</span>`;
    }

    const borderClass = getTypeClass(card.type);
    const badgeClass = getBadgeClass(card.type);
    const completionPercent = calculateCompletion(card.readPages, card.totalPages);
    const completionText = completionPercent === 100 ? "Completed" : `Completion: ${completionPercent}%`;
    const quoteHTML = card.quote ? `<div class="quote-container" title="${card.quote.replace(/"/g, '&quot;')}">"${card.quote}"</div>` : '';

    const cardHTML = `
      <div class="card ${borderClass}">
        <div class="card-header">
          <h1 class="card-title">${card.title}</h1>
          <div class="header-actions">
            <span class="badge ${badgeClass}">${card.type}</span>
          </div>
        </div>
        <hr class="divider">
        <div class="metadata">
          <p class="author-date">${card.author} &middot; ${card.date}</p>
          <div class="completion-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span class="${completionPercent === 100 ? 'percent' : ''}">${completionText}</span>
          </div>
        </div>
        ${quoteHTML}
        <div class="tags-container">${tagsHTML}</div>
        <button class="delete-btn" onclick="deleteCard('${card.id}')" title="Delete Card">&times;</button>
      </div>
    `;
    cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
  });
}

cardForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const totalPages = parseInt(document.getElementById('totalPages').value) || 0;
  const readPages = parseInt(document.getElementById('readPages').value) || 0;
  const errorSpan = document.getElementById('pagesError');
  const readPagesInput = document.getElementById('readPages');

  if (readPages > totalPages) {
    errorSpan.style.display = 'block';
    readPagesInput.classList.add('input-error');
    return;
  } else {
    errorSpan.style.display = 'none';
    readPagesInput.classList.remove('input-error');
  }

  const tagsInput = document.getElementById('tags').value;
  const typeValue = document.getElementById('type').value;
  const availableChecked = document.getElementById('available').checked;
  const quoteValue = document.getElementById('quote').value;

  const newCardObject = {
    id: Date.now().toString(),
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    date: document.getElementById('date').value,
    type: typeValue,
    tags: tagsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
    available: availableChecked,
    quote: quoteValue,
    totalPages: totalPages,
    readPages: readPages
  };

  cardsData.push(newCardObject);
  renderCards();
  cardForm.reset();
  
  formWrapper.classList.add('hidden');
  toggleFormBtn.innerHTML = formBtnHTML;
});

function deleteCard(id) {
  cardsData = cardsData.filter(card => card.id !== id);
  renderCards();
}

renderCards();