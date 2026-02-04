// Scrapbook Logic

// Initialize components
document.getElementById('header-container').innerHTML = Components.Header(window.location.pathname);
Components.initHeader();
document.getElementById('decorations-container').innerHTML = Components.FloatingHearts();
lucide.createIcons();

const canvas = document.getElementById('canvas');

function renderItem(item) {
    const el = document.createElement('div');
    el.id = item.id;
    el.className = 'absolute cursor-move select-none group transition-shadow';
    el.style.left = `${item.x}px`;
    el.style.top = `${item.y}px`;
    el.style.zIndex = item.zIndex;
    el.style.transform = `rotate(${item.rotate}deg)`;

    // Delete button (visible on hover)
    const deleteBtn = `
        <button class="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50 hover:bg-red-600" onclick="deleteItem('${item.id}', event)">
            <i data-lucide="x" class="w-3 h-3"></i>
        </button>
    `;

    if (item.type === 'photo') {
        el.innerHTML = `
            <div class="sketchy-card bg-white p-3 pb-8 w-48 shadow-lg">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-pink-300/60 shadow-sm" 
                     style="clip-path: polygon(0% 5%, 5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%)">
                </div>
                <div class="relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-100 mb-2 pointer-events-none">
                    <img src="${item.content}" alt="Scrapbook item" class="object-cover w-full h-full">
                </div>
            </div>
            ${deleteBtn}
        `;
    } else {
        el.innerHTML = `
            <div class="sketchy-card bg-yellow-100 p-4 w-48 shadow-lg transform hover:scale-105 transition-transform">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-red-400 opacity-20"></div>
                <p class="font-handwriting text-lg text-gray-800 text-center leading-tight break-words">${item.content}</p>
            </div>
            ${deleteBtn}
        `;
    }

    // Setup Dragging
    setupDrag(el, item);

    canvas.appendChild(el);
    lucide.createIcons();
}

function setupDrag(el, item) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const startDrag = (e) => {
        // Prevent drag if clicking delete button
        if (e.target.closest('button')) return;

        // Get coordinates (touch or mouse)
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        isDragging = true;
        startX = clientX;
        startY = clientY;
        initialLeft = parseFloat(el.style.left);
        initialTop = parseFloat(el.style.top);
        
        // Bring to front
        Store.state.highestZ++;
        el.style.zIndex = Store.state.highestZ;
        item.zIndex = Store.state.highestZ;
        
        el.style.cursor = 'grabbing';
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling on touch

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
    };

    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            el.style.cursor = 'move';
            // Save new position
            Store.updateItem && Store.updateItem(item.id, {
                x: parseFloat(el.style.left),
                y: parseFloat(el.style.top),
                zIndex: parseInt(el.style.zIndex)
            });
            // Manual save fallback
            const idx = Store.state.items.findIndex(i => i.id === item.id);
            if (idx !== -1) {
                Store.state.items[idx].x = parseFloat(el.style.left);
                Store.state.items[idx].y = parseFloat(el.style.top);
                Store.state.items[idx].zIndex = parseInt(el.style.zIndex);
                Store.save();
            }
        }
    };

    // Mouse Events
    el.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    // Touch Events
    el.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
}

// Global delete function
window.deleteItem = (id, event) => {
    event.stopPropagation();
    Store.removeItem(id);
};

// Render all items
function renderCanvas() {
    canvas.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center text-romantic-300 pointer-events-none">
            <p class="text-2xl opacity-50">Drag and drop photos and notes here</p>
        </div>
    `;
    Store.state.items.forEach(renderItem);
}

// Initial Render
renderCanvas();
Store.subscribe('items', renderCanvas);

// Actions
document.getElementById('add-photo-btn').onclick = () => {
    const id = Date.now().toString();
    const item = {
        id,
        type: 'photo',
        content: `https://picsum.photos/seed/${id}/300`,
        rotate: Math.random() * 10 - 5,
        zIndex: Store.state.highestZ + 1,
        x: Math.random() * (canvas.clientWidth - 200) + 50,
        y: Math.random() * (canvas.clientHeight - 200) + 50,
    };
    Store.addItem(item);
};

document.getElementById('add-note-btn').onclick = () => {
    const text = document.getElementById('note-input').value;
    if (text.trim()) {
        const item = {
            id: Date.now().toString(),
            type: 'note',
            content: text,
            rotate: Math.random() * 10 - 5,
            zIndex: Store.state.highestZ + 1,
            x: Math.random() * (canvas.clientWidth - 200) + 50,
            y: Math.random() * (canvas.clientHeight - 200) + 50,
        };
        Store.addItem(item);
        document.getElementById('note-input').value = '';
    }
};

document.getElementById('note-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('add-note-btn').click();
});

document.getElementById('clear-btn').onclick = () => {
    if (confirm('Clear scrapbook?')) {
        Store.clearItems();
    }
};
