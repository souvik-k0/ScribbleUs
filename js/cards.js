// Cards Logic

// Initialize components
document.getElementById('header-container').innerHTML = Components.Header(window.location.pathname);
Components.initHeader();
document.getElementById('decorations-container').innerHTML = Components.FloatingHearts();
lucide.createIcons();

let selectedTemplate = cardTemplates[0];

const templateGrid = document.getElementById('template-grid');
const cardPreview = document.getElementById('card-preview');
const cardEmoji = document.getElementById('card-emoji');
const cardFrontText = document.getElementById('card-front-text');
const cardInsideText = document.getElementById('card-inside-text');

function renderTemplates() {
    templateGrid.innerHTML = '';
    cardTemplates.forEach(template => {
        const btn = document.createElement('button');
        const isSelected = template.id === selectedTemplate.id;
        btn.className = `p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${isSelected ? 'border-romantic-600 bg-romantic-100 shadow-lg' : 'border-romantic-200 hover:border-romantic-400'}`;
        btn.innerHTML = `
            <div class="text-3xl mb-1">${template.emoji}</div>
            <div class="font-bold text-romantic-800">${template.name}</div>
        `;
        btn.onclick = () => selectTemplate(template);
        templateGrid.appendChild(btn);
    });
}

function selectTemplate(template) {
    selectedTemplate = template;
    renderTemplates();
    updatePreview(true);
}

const cardFront = document.getElementById('card-front');
const cardInside = document.getElementById('card-inside');

function setCardState(isOpen) {
    if (isOpen) {
        cardFront.classList.add('opacity-0', 'pointer-events-none');
        cardInside.classList.remove('opacity-0', 'pointer-events-none');
        cardInside.classList.add('opacity-100', 'pointer-events-auto');
        cardPreview.classList.add('is-open');
    } else {
        cardFront.classList.remove('opacity-0', 'pointer-events-none');
        cardInside.classList.remove('opacity-100', 'pointer-events-auto');
        cardInside.classList.add('opacity-0', 'pointer-events-none');
        cardPreview.classList.remove('is-open');
    }
}

function updatePreview(resetFlip = false) {
    if (resetFlip) {
        setCardState(false);
    }
    
    cardEmoji.textContent = selectedTemplate.emoji;
    cardFrontText.textContent = selectedTemplate.frontText;
    cardFrontText.style.color = selectedTemplate.colors[0];
    
    // Default text or custom
    const recipient = document.getElementById('recipient-name').value || 'Love';
    const customMsg = document.getElementById('custom-message').value;
    
    let message = `Dear ${recipient},\n\n`;
    if (customMsg) {
        message += customMsg;
    } else {
        message += `${selectedTemplate.insidePrompt}...\n\n(Click 'Generate Card' to see AI magic!)`;
    }
    message += `\n\nWith all my heart ❤️`;
    
    cardInsideText.textContent = message;
}

// Flip Logic
cardPreview.onclick = () => {
    const isFrontVisible = !cardFront.classList.contains('opacity-0');
    setCardState(isFrontVisible);
};

// Generate Logic
document.getElementById('generate-btn').onclick = async () => {
    // Check for API Key
    if (!Store.state.apiKey) {
        const modal = document.getElementById('ai-modal');
        if (modal) modal.classList.remove('hidden');
        else alert("Please set your API Key in the settings first!");
        return;
    }

    const btn = document.getElementById('generate-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div> Generating...';
    btn.disabled = true;

    try {
        const recipient = document.getElementById('recipient-name').value || 'Love';
        const customMsg = document.getElementById('custom-message').value;
        
        let aiMessage = `Dear ${recipient},\n\n`;
        
        // Use AI Service
        const generatedText = await AIService.generateCardMessage(recipient, selectedTemplate.category, customMsg);
        aiMessage += generatedText;
        
        aiMessage += `\n\nForever yours ❤️`;
        cardInsideText.textContent = aiMessage;
        
        // Auto flip to show result
        if (!cardPreview.classList.contains('is-open')) {
            setCardState(true);
        }

        btn.innerHTML = originalContent;
        btn.disabled = false;
    } catch (error) {
        console.error(error);
        alert("Failed to generate card message: " + error.message);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
};

// Initial Render
renderTemplates();
updatePreview();
