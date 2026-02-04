// Artwork Logic

// Initialize components
document.getElementById('header-container').innerHTML = Components.Header(window.location.pathname);
Components.initHeader();
document.getElementById('decorations-container').innerHTML = Components.FloatingHearts();
lucide.createIcons();

const artStyles = [
    { id: 'watercolor', name: 'Watercolor', emoji: '🎨', filter: 'saturate(1.5) brightness(1.1) contrast(0.9) blur(0.5px)' },
    { id: 'vintage', name: 'Vintage', emoji: '📷', filter: 'sepia(0.6) contrast(0.8) brightness(0.9)' },
    { id: 'pop-art', name: 'Pop Art', emoji: '🎭', filter: 'saturate(2.5) contrast(1.3) hue-rotate(-15deg)' },
    { id: 'sketch', name: 'Sketch', emoji: '✏️', filter: 'grayscale(1) contrast(2) brightness(1.2)' },
    { id: 'neon', name: 'Neon', emoji: '✨', filter: 'saturate(2) brightness(1.1) hue-rotate(180deg) contrast(1.1)' },
    { id: 'black-white', name: 'Classic B&W', emoji: '⚫', filter: 'grayscale(1) contrast(1.1)' },
];

let selectedStyleId = 'watercolor';

const styleGrid = document.getElementById('style-grid');
const previewImage = document.getElementById('preview-image');
const styleNameSpan = document.getElementById('current-style-name');
const loadingOverlay = document.getElementById('loading-overlay');

function renderStyles() {
    styleGrid.innerHTML = '';
    artStyles.forEach(style => {
        const btn = document.createElement('button');
        const isSelected = style.id === selectedStyleId;
        btn.className = `p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${isSelected ? 'border-romantic-600 bg-romantic-100 shadow-lg scale-105' : 'border-romantic-200 hover:border-romantic-400'}`;
        btn.innerHTML = `
            <div class="text-4xl mb-2">${style.emoji}</div>
            <div class="font-bold text-romantic-800">${style.name}</div>
        `;
        btn.onclick = () => applyStyle(style);
        styleGrid.appendChild(btn);
    });
}

function applyStyle(style) {
    selectedStyleId = style.id;
    styleNameSpan.textContent = style.name;
    renderStyles();

    // Show loading
    loadingOverlay.classList.remove('opacity-0');
    
    setTimeout(() => {
        previewImage.style.filter = style.filter;
        loadingOverlay.classList.add('opacity-0');
    }, 500);
    
    // Reset caption
    const resultDiv = document.getElementById('ai-caption-result');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';
}

// Initial render
renderStyles();
// Apply initial filter
const initialStyle = artStyles.find(s => s.id === selectedStyleId);
if (initialStyle) previewImage.style.filter = initialStyle.filter;

document.getElementById('new-photo-btn').onclick = () => {
    loadingOverlay.classList.remove('opacity-0');
    setTimeout(() => {
        previewImage.src = `https://picsum.photos/seed/${Date.now()}/600/600`;
        // Keep filter
        loadingOverlay.classList.add('opacity-0');
    }, 800);
};

// AI Logic
document.getElementById('ai-caption-btn').onclick = async () => {
    if (!Store.state.apiKey) {
        const modal = document.getElementById('ai-modal');
        if (modal) modal.classList.remove('hidden');
        else alert("Please set your API Key in the settings first!");
        return;
    }

    const btn = document.getElementById('ai-caption-btn');
    const resultDiv = document.getElementById('ai-caption-result');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div> Generating...';
    btn.disabled = true;

    try {
        const styleName = artStyles.find(s => s.id === selectedStyleId)?.name || 'Artistic';
        const caption = await AIService.analyzeArtwork(styleName);
        
        resultDiv.textContent = `"${caption}"`;
        resultDiv.classList.remove('hidden');
        
        btn.innerHTML = originalContent;
        btn.disabled = false;
    } catch (error) {
        console.error(error);
        alert("Failed to generate caption: " + error.message);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
};
