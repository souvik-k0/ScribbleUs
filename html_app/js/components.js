// Shared Components

const Components = {
    Header: (currentPath = '/') => {
        const navItems = [
            { href: 'index.html', label: 'Home', icon: 'home' },
            { href: 'scrapbook.html', label: 'Scrapbook', icon: 'book' },
            { href: 'love-letter.html', label: 'Love Letter', icon: 'sparkles' },
            { href: 'cards.html', label: 'Cards', icon: 'heart-handshake' }, // Using heart-handshake as generic love icon or message-circle-heart if available
            { href: 'timeline.html', label: 'Timeline', icon: 'calendar' },
            { href: 'artwork.html', label: 'Artwork', icon: 'image' },
        ];

        // Map icons to Lucide icons
        const iconMap = {
            'home': '<i data-lucide="home" class="w-4 h-4"></i>',
            'book': '<i data-lucide="book" class="w-4 h-4"></i>',
            'sparkles': '<i data-lucide="sparkles" class="w-4 h-4"></i>',
            'heart-handshake': '<i data-lucide="message-circle-heart" class="w-4 h-4"></i>',
            'calendar': '<i data-lucide="calendar" class="w-4 h-4"></i>',
            'image': '<i data-lucide="image" class="w-4 h-4"></i>',
        };

        const navHtml = navItems.map(item => {
            const isActive = currentPath.endsWith(item.href) || (currentPath === '/' && item.href === 'index.html');
            const activeClass = isActive 
                ? 'bg-romantic-500 text-white shadow-md' 
                : 'text-romantic-700 hover:bg-romantic-100';
            
            return `
                <a href="${item.href}" class="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${activeClass}">
                    ${iconMap[item.icon]}
                    ${item.label}
                </a>
            `;
        }).join('');

        const mobileNavHtml = navItems.map(item => {
             return `
                <a href="${item.href}" class="flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-romantic-700 hover:bg-romantic-100">
                    ${iconMap[item.icon]}
                    ${item.label}
                </a>
            `;
        }).join('');

        return `
            <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-romantic-800 shadow-lg">
                <div class="container mx-auto px-4 py-3">
                    <div class="flex items-center justify-between">
                        <!-- Logo -->
                        <a href="index.html" class="flex items-center gap-2 group">
                            <div class="heart-glow transition-transform hover:scale-110 active:scale-95">
                                <i data-lucide="heart" class="w-8 h-8 fill-romantic-500 text-romantic-500"></i>
                            </div>
                            <h1 class="text-3xl font-bold text-romantic-700">
                                ScribbleUs
                            </h1>
                        </a>

                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center gap-2">
                            <nav class="flex items-center gap-2">
                                ${navHtml}
                            </nav>
                            <div class="w-px h-6 bg-romantic-200 mx-2"></div>
                            <button id="ai-settings-btn" class="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-romantic-700 hover:bg-romantic-100 transition-all duration-200" title="AI Settings">
                                <i data-lucide="bot" class="w-4 h-4"></i>
                                AI Setup
                            </button>
                        </div>

                        <!-- Mobile Menu Toggle -->
                        <div class="md:hidden">
                            <button id="mobile-menu-btn" class="p-2 text-romantic-700 hover:bg-romantic-100 rounded-full transition-colors">
                                <i data-lucide="menu" class="w-8 h-8" id="menu-icon"></i>
                                <i data-lucide="x" class="w-8 h-8 hidden" id="close-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Navigation Dropdown -->
                <div id="mobile-menu" class="md:hidden hidden border-t-2 border-romantic-200 bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-300">
                    <nav class="flex flex-col p-4 space-y-2">
                        ${mobileNavHtml}
                        <button id="mobile-ai-settings-btn" class="flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-romantic-700 hover:bg-romantic-100 w-full text-left">
                            <i data-lucide="bot" class="w-4 h-4"></i>
                            AI Setup
                        </button>
                    </nav>
                </div>
            </header>
            
            <!-- AI Setup Modal -->
            <div id="ai-modal" class="fixed inset-0 z-[60] hidden">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="ai-modal-backdrop"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                    <div class="bg-white rounded-2xl shadow-2xl border-4 border-romantic-200 p-6 relative animate-bounce-in">
                        <button id="close-ai-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                        
                        <div class="flex flex-col items-center gap-4 text-center">
                            <div class="w-16 h-16 bg-romantic-100 rounded-full flex items-center justify-center">
                                <i data-lucide="bot" class="w-8 h-8 text-romantic-500"></i>
                            </div>
                            <h2 class="text-2xl font-bold text-romantic-800">AI Setup</h2>
                            <p class="text-gray-600">
                                Enter your Gemini API Key to unlock AI features like Love Letter generation and Card messages.
                            </p>
                            
                            <div class="w-full text-left">
                                <label class="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                                <input type="password" id="api-key-input" class="w-full px-4 py-2 rounded-lg border-2 border-romantic-200 focus:border-romantic-500 focus:outline-none transition-colors" placeholder="Enter your API key...">
                                <p class="text-xs text-gray-500 mt-2">
                                    Don't have one? <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-romantic-500 hover:underline">Get it here</a>
                                </p>
                            </div>
                            
                            <button id="save-api-key" class="w-full py-3 bg-romantic-500 hover:bg-romantic-600 text-white rounded-xl font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95">
                                Save Key
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    initHeader: () => {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            });
        }
        
        // AI Modal Logic
        const modal = document.getElementById('ai-modal');
        const aiBtns = [document.getElementById('ai-settings-btn'), document.getElementById('mobile-ai-settings-btn')];
        const closeBtn = document.getElementById('close-ai-modal');
        const backdrop = document.getElementById('ai-modal-backdrop');
        const saveBtn = document.getElementById('save-api-key');
        const input = document.getElementById('api-key-input');
        
        const openModal = () => {
            modal.classList.remove('hidden');
            input.value = Store.state.apiKey || '';
        };
        
        const closeModal = () => {
            modal.classList.add('hidden');
        };
        
        aiBtns.forEach(btn => btn?.addEventListener('click', openModal));
        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);
        
        saveBtn?.addEventListener('click', () => {
            const key = input.value.trim();
            if (key) {
                Store.setApiKey(key);
                // Visual feedback
                const originalText = saveBtn.innerText;
                saveBtn.innerText = 'Saved!';
                saveBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                setTimeout(() => {
                    closeModal();
                    saveBtn.innerText = originalText;
                    saveBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                }, 1000);
            }
        });
    },

    FloatingHearts: () => {
        return `
            <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div class="absolute top-10 left-10 text-romantic-200 animate-pulse delay-75">
                    <i data-lucide="heart" class="w-12 h-12 fill-current opacity-20"></i>
                </div>
                <div class="absolute top-1/4 right-20 text-romantic-300 animate-pulse delay-1000">
                    <i data-lucide="heart" class="w-8 h-8 fill-current opacity-20"></i>
                </div>
                <div class="absolute bottom-1/3 left-20 text-romantic-200 animate-pulse delay-500">
                    <i data-lucide="sparkles" class="w-10 h-10 opacity-30"></i>
                </div>
                <div class="absolute bottom-10 right-10 text-romantic-400 animate-pulse delay-200">
                    <i data-lucide="heart" class="w-16 h-16 fill-current opacity-10"></i>
                </div>
            </div>
        `;
    }
};
