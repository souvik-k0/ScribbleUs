// Timeline Logic

// Initialize components
document.getElementById('header-container').innerHTML = Components.Header(window.location.pathname);
Components.initHeader();
document.getElementById('decorations-container').innerHTML = Components.FloatingHearts();
lucide.createIcons();

const emojis = ['❤️', '💕', '🎉', '🌹', '💍', '🎂', '✈️', '🏠', '👶', '🎓', '🌟'];
let selectedEmoji = '❤️';

// Setup Emoji Selector
const emojiContainer = document.getElementById('emoji-selector');
emojis.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = `text-2xl p-2 rounded-lg hover:bg-romantic-100 transition-colors ${emoji === selectedEmoji ? 'bg-romantic-100 ring-2 ring-romantic-400' : ''}`;
    btn.textContent = emoji;
    btn.onclick = () => {
        selectedEmoji = emoji;
        // Update visual selection
        Array.from(emojiContainer.children).forEach(c => c.classList.remove('bg-romantic-100', 'ring-2', 'ring-romantic-400'));
        btn.classList.add('bg-romantic-100', 'ring-2', 'ring-romantic-400');
    };
    emojiContainer.appendChild(btn);
});

// Render Timeline
function renderTimeline(milestones) {
    const container = document.getElementById('timeline-items');
    container.innerHTML = '';

    if (milestones.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-10">No memories yet. Add your first milestone!</p>';
        return;
    }

    milestones.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const dateStr = new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        
        const div = document.createElement('div');
        div.className = `relative flex items-center justify-between md:justify-normal md:${isEven ? 'flex-row-reverse' : 'flex-row'}`;
        
        // Using innerHTML for complex structure
        div.innerHTML = `
            <!-- Empty space for desktop layout -->
            <div class="hidden md:block w-5/12"></div>
            
            <!-- Center Dot -->
            <div class="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-romantic-500 flex items-center justify-center z-10 shadow-md">
                <span class="text-xs">${item.emoji}</span>
            </div>

            <!-- Content Card -->
            <div class="w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:pr-8' : 'md:pl-8'}">
                <div class="sketchy-card p-6 relative group hover:z-20">
                    <button class="delete-btn absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" data-id="${item.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    
                    <span class="inline-block px-3 py-1 rounded-full bg-romantic-100 text-romantic-700 text-sm font-bold mb-2">
                        ${dateStr}
                    </span>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
                    <p class="text-gray-600 mb-4">${item.description}</p>
                    
                    ${item.photos && item.photos.length > 0 ? `
                        <div class="mt-4 -mx-2">
                            <img src="${item.photos[0]}" alt="${item.title}" class="w-full h-48 object-cover rounded-lg transform rotate-2 hover:rotate-0 transition-transform duration-300 shadow-md">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });

    // Attach delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Delete this memory?')) {
                Store.removeMilestone(id);
            }
        });
    });

    lucide.createIcons();
}

// Initial Render
renderTimeline(Store.state.milestones);

// Subscribe to changes
Store.subscribe('milestones', (milestones) => {
    renderTimeline(milestones);
});

// UI Logic
const addBtn = document.getElementById('add-btn');
const addForm = document.getElementById('add-form');
const closeForm = document.getElementById('close-form');
const saveBtn = document.getElementById('save-milestone');
const aiBtn = document.getElementById('ai-generate-btn');

addBtn.onclick = () => {
    addForm.classList.remove('hidden');
    addForm.scrollIntoView({ behavior: 'smooth' });
};

closeForm.onclick = () => {
    addForm.classList.add('hidden');
};

saveBtn.onclick = () => {
    const title = document.getElementById('new-title').value;
    const date = document.getElementById('new-date').value;
    const desc = document.getElementById('new-description').value;

    if (!title || !date) {
        alert('Please enter at least a title and date!');
        return;
    }

    Store.addMilestone({
        id: Date.now().toString(),
        title,
        date: new Date(date),
        description: desc,
        emoji: selectedEmoji,
        photos: [] // In a real app we'd handle uploads
    });

    // Reset form
    document.getElementById('new-title').value = '';
    document.getElementById('new-date').value = '';
    document.getElementById('new-description').value = '';
    addForm.classList.add('hidden');
};

aiBtn.onclick = () => {
    const title = document.getElementById('new-title').value;
    if (!title) {
        alert('Enter a title first so AI knows what to write about!');
        return;
    }
    
    // Simulate AI
    const btn = aiBtn;
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<div class="animate-spin h-4 w-4 border-2 border-romantic-600 rounded-full border-t-transparent"></div>';
    
    setTimeout(() => {
        const descriptions = [
            "A magical moment we'll cherish forever.",
            "The day everything changed for the better.",
            "Laughter, joy, and unforgettable memories.",
            "Simply perfect in every way."
        ];
        document.getElementById('new-description').value = descriptions[Math.floor(Math.random() * descriptions.length)];
        btn.innerHTML = originalIcon;
    }, 1000);
};
