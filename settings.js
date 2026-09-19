const STORAGE_KEY = 'fitness_nutrients_105';

const defaultNutrients = [
  { id: 1, name: 'Creatine', current: 5, target: 5, unit: 'g', color: '#4CAF50' },
  { id: 2, name: 'Vitamin C', current: 75, target: 90, unit: 'mg', color: '#FF9800' }
];

function getNutrients() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return [...defaultNutrients];
  }

  try {
    const nutrients = JSON.parse(storedData);
    return Array.isArray(nutrients) ? nutrients : [...defaultNutrients];
  } catch {
    return [...defaultNutrients];
  }
}

function saveNutrients(nutrients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nutrients));
  renderTrackerList();
}

function renderTrackerList() {
  const listElement = document.getElementById('tracker-list');
  const nutrients = getNutrients();
  listElement.replaceChildren();

  if (nutrients.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-list';
    emptyItem.textContent = 'कोई न्यूट्रिएंट जोड़ा नहीं गया है।';
    listElement.appendChild(emptyItem);
    return;
  }

  nutrients.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = 'tracker-item';

    const info = document.createElement('div');
    info.className = 'tracker-info';

    const colorBadge = document.createElement('span');
    colorBadge.className = 'color-badge';
    colorBadge.style.backgroundColor = item.color;

    const details = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = item.name;
    const values = document.createElement('small');
    values.textContent = `${item.current} / ${item.target} ${item.unit}`;
    details.append(name, document.createElement('br'), values);
    info.append(colorBadge, details);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'हटाएं';
    deleteButton.addEventListener('click', () => deleteNutrient(item.id));

    listItem.append(info, deleteButton);
    listElement.appendChild(listItem);
  });
}

function deleteNutrient(id) {
  const nutrients = getNutrients().filter((item) => item.id !== id);
  saveNutrients(nutrients);
}

document.getElementById('nutrient-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('nutrient-name').value.trim();
  const current = Number.parseFloat(document.getElementById('min-val').value);
  const target = Number.parseFloat(document.getElementById('max-val').value);
  const unit = document.getElementById('unit').value.trim();
  const color = document.getElementById('color-code').value;

  if (!name || !unit || !Number.isFinite(current) || !Number.isFinite(target) || target < 1 || current < 0) {
    return;
  }

  const nutrients = getNutrients();
  nutrients.push({ id: Date.now(), name, current, target, unit, color });
  saveNutrients(nutrients);

  event.target.reset();
  document.getElementById('color-code').value = '#4CAF50';
});

renderTrackerList();
