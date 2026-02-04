// Store management (mimicking Zustand)

const Store = {
    state: {
        items: [],
        highestZ: 1,
        savedLetters: [],
        savedCards: [],
        savedScrapbooks: [],
        milestones: timelineMilestones || [], // Use dummy data initially if not in local storage
    },

    init() {
        const savedState = localStorage.getItem('scribbleus-storage');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                // Zustand persist structure: { state: { ... }, version: 0 }
                if (parsed.state) {
                    this.state = { ...this.state, ...parsed.state };
                    
                    // Remove apiKey from state if it was accidentally saved in localStorage
                    if (this.state.apiKey) {
                        delete this.state.apiKey;
                    }

                    // Convert date strings back to Date objects for milestones
                    if (this.state.milestones) {
                        this.state.milestones = this.state.milestones.map(m => ({
                            ...m,
                            date: new Date(m.date)
                        }));
                    }
                }
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }

        // Load API Key from Session Storage
        const sessionKey = sessionStorage.getItem('scribbleus-api-key');
        if (sessionKey) {
            this.state.apiKey = sessionKey;
        } else {
            this.state.apiKey = '';
        }
    },

    save() {
        // Exclude apiKey from localStorage persistence
        const { apiKey, ...persistentState } = this.state;
        localStorage.setItem('scribbleus-storage', JSON.stringify({ state: persistentState, version: 0 }));
    },

    // Actions
    addItem(item) {
        this.state.items.push(item);
        this.state.highestZ++;
        this.save();
        this.notify('items');
    },

    removeItem(id) {
        this.state.items = this.state.items.filter(item => item.id !== id);
        this.save();
        this.notify('items');
    },

    clearItems() {
        this.state.items = [];
        this.save();
        this.notify('items');
    },

    addMilestone(milestone) {
        this.state.milestones.push(milestone);
        // Sort by date
        this.state.milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.save();
        this.notify('milestones');
    },

    removeMilestone(id) {
        this.state.milestones = this.state.milestones.filter(m => m.id !== id);
        this.save();
        this.notify('milestones');
    },

    saveLetter(letter) {
        this.state.savedLetters.push(letter);
        this.save();
        this.notify('savedLetters');
    },

    setApiKey(key) {
        this.state.apiKey = key;
        sessionStorage.setItem('scribbleus-api-key', key);
        this.notify('apiKey');
    },

    // Simple observer pattern
    listeners: {},
    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        };
    },

    notify(key) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(cb => cb(this.state[key]));
        }
    }
};

Store.init();
