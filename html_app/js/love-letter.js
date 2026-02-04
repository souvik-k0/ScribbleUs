// Love Letter Logic

// Initialize components
document.getElementById('header-container').innerHTML = Components.Header(window.location.pathname);
Components.initHeader();
document.getElementById('decorations-container').innerHTML = Components.FloatingHearts();
lucide.createIcons();

const styles = [
    { id: 'romantic', name: 'Romantic', icon: '💕' },
    { id: 'funny', name: 'Funny', icon: '😄' },
    { id: 'poetic', name: 'Poetic', icon: '✨' },
];

const tones = [
    { id: 'celebratory', name: 'Celebratory', icon: '🎉' },
    { id: 'apologetic', name: 'Apologetic', icon: '🙏' },
    { id: 'nostalgic', name: 'Nostalgic', icon: '🌟' },
];

let selectedStyle = 'romantic';
let selectedTone = 'celebratory';
let generatedContent = '';

// Setup Selectors
function setupSelector(items, containerId, selectionVar, updateFn) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        const btn = document.createElement('button');
        const isSelected = item.id === selectionVar;
        btn.className = `p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${isSelected ? 'border-romantic-500 bg-romantic-100' : 'border-romantic-200 hover:border-romantic-300'}`;
        btn.innerHTML = `
            <span class="text-2xl">${item.icon}</span>
            <span class="text-xs font-bold text-gray-700">${item.name}</span>
        `;
        btn.onclick = () => {
            updateFn(item.id);
            // Visual update
            Array.from(container.children).forEach(c => {
                c.className = c.className.replace('border-romantic-500 bg-romantic-100', 'border-romantic-200 hover:border-romantic-300');
            });
            btn.className = btn.className.replace('border-romantic-200 hover:border-romantic-300', 'border-romantic-500 bg-romantic-100');
        };
        container.appendChild(btn);
    });
}

setupSelector(styles, 'style-selector', selectedStyle, (val) => selectedStyle = val);
setupSelector(tones, 'tone-selector', selectedTone, (val) => selectedTone = val);

// Generator Logic
const generateBtn = document.getElementById('generate-btn');
const letterContent = document.getElementById('letter-content');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');

generateBtn.onclick = async () => {
    // Check for API Key
    if (!Store.state.apiKey) {
        // Trigger modal if possible, or alert
        const modal = document.getElementById('ai-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Optional: highlight input
        } else {
            alert("Please set your API Key in the settings first!");
        }
        return;
    }

    // UI Loading state
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div> Generating...';
    generateBtn.disabled = true;

    try {
        const partnerName = document.getElementById('partner-name').value || 'My Love';
        
        // Call AI Service
        const content = await AIService.generateLoveLetter(partnerName, selectedStyle, selectedTone);
        
        generatedContent = content;
        
        // Typewriter effect
        letterContent.textContent = '';
        let i = 0;
        const typeWriter = setInterval(() => {
            if (i < content.length) {
                letterContent.textContent += content.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
            }
        }, 10); // Speed of typing

    } catch (error) {
        console.error(error);
        alert("Failed to generate letter: " + error.message);
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
};

copyBtn.onclick = () => {
    navigator.clipboard.writeText(generatedContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Copied!';
        lucide.createIcons();
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            lucide.createIcons();
        }, 2000);
    });
};

downloadBtn.onclick = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-letter-${Date.now()}.txt`;
    a.click();
    
    // Save to store
    Store.saveLetter({
        id: Date.now().toString(),
        content: generatedContent,
        style: selectedStyle,
        tone: selectedTone,
        createdAt: new Date(),
        partnerName: document.getElementById('partner-name').value || 'My Love'
    });
};
