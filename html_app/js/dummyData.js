// Dummy data for prototype

const coupleProfile = {
    partner1: "Alex",
    partner2: "Jordan",
    anniversary: new Date("2022-06-15"),
    story: "We met at a coffee shop on a rainy day...",
    insideJokes: ["The penguin incident", "Tuesday pizza tradition"],
};

// Pre-generated love letters with different styles
const lovLetterExamples = {
    romantic: {
        celebratory: `My Dearest Jordan,

Every moment with you feels like a beautiful dream I never want to wake from. Your smile lights up my darkest days, and your laughter is the sweetest melody I know. Thank you for being my partner, my love, and my best friend. Here's to many more incredible years together.

Forever yours,
Alex ❤️`,

        apologetic: `My Love,

I'm so sorry for the silly argument yesterday. You mean the world to me, and I never want my words to hurt you. Your patience and kindness humble me every day. Please forgive me – I promise to be better, to listen more, and to cherish every moment we have.

With all my heart,
Alex 💕`,

        nostalgic: `Dear Jordan,

Remember that rainy afternoon when we first met? I had no idea that sharing an umbrella would lead to sharing a lifetime. Every memory we've created since then – from our Tuesday pizza nights to the penguin incident we'll never live down – is a treasure I hold close to my heart.

Loving you always,
Alex 🌹`
    },

    funny: {
        celebratory: `Hey You,

Happy Anniversary to the only person who tolerates my terrible jokes and still laughs! Thanks for putting up with my snoring, my obsession with weird documentaries, and that time I tried to cook and almost burned down the kitchen. You're stuck with me now – no refunds!

Love you, weirdo,
Alex 😂❤️`,

        apologetic: `Jordan,

I messed up. Again. I know, I know – add it to the list right after "The Great Penguin Incident" and "Pizza Tuesday Disaster of 2023." But seriously, I'm sorry. You deserve better than my foot-in-mouth moments. Forgive me? I'll make it up with your favorite dessert!

Your lovable idiot,
Alex 🙈`,

        nostalgic: `Remember When...

We thought "one more episode" meant one? Or when we got lost for 3 hours because someone (me) refused to use GPS? Those early days of chaos somehow turned into this beautiful mess we call 'us.' Every ridiculous moment with you is my favorite memory.

Still getting lost with you,
Alex 😄💕`
    },

    poetic: {
        celebratory: `In the garden of my heart, you bloom eternal,
A rose among thorns, gentle and supernal.
Each petal whispers secrets of our days,
Each thorn a lesson learned along love's maze.
Today we celebrate the journey we've begun,
Two souls entwined, forever one.

Yours in verse and love,
Alex 🌹✨`,

        apologetic: `If I could paint my sorrow on the sky,
Each star would spell the reasons why
I'm sorry for the pain I've caused,
For moments when my love seemed paused.
Forgive me, darling, let us start anew,
My heart beats only, ever, just for you.

Yours in sincere devotion,
Alex 💫`,

        nostalgic: `Time's river flows, yet memories stay,
Like autumn leaves that never fade away.
Your laughter echoes through the years,
A symphony that calms my fears.
From coffee shops to present day,
Our love grows stronger in every way.

Forever remembering,
Alex 🍂❤️`
    }
};

// Timeline milestones
const timelineMilestones = [
    {
        id: "1",
        date: new Date("2022-06-15"),
        title: "First Date",
        description: "Coffee shop meet-cute on a rainy day ☔",
        photos: ["https://picsum.photos/seed/firstdate/400/300"],
        emoji: "☕"
    },
    {
        id: "2",
        date: new Date("2022-08-20"),
        title: "First 'I Love You'",
        description: "Under the stars at the beach 🌟",
        photos: ["https://picsum.photos/seed/iloveyou/400/300"],
        emoji: "💕"
    },
    {
        id: "3",
        date: new Date("2022-11-10"),
        title: "The Penguin Incident",
        description: "That zoo trip we'll never forget 🐧",
        photos: ["https://picsum.photos/seed/penguin/400/300"],
        emoji: "🐧"
    },
    {
        id: "4",
        date: new Date("2023-06-15"),
        title: "First Anniversary",
        description: "Paris getaway and the Eiffel Tower proposal 🗼",
        photos: ["https://picsum.photos/seed/paris/400/300"],
        emoji: "💍"
    },
    {
        id: "5",
        date: new Date("2024-06-15"),
        title: "Two Years Strong",
        description: "Still going strong, still in love ❤️",
        photos: ["https://picsum.photos/seed/twoyears/400/300"],
        emoji: "🎉"
    }
];

// Card templates
const cardTemplates = [
    {
        id: "birthday",
        name: "Birthday",
        category: "celebration",
        frontText: "Happy Birthday!",
        insidePrompt: "Write a heartfelt birthday message",
        colors: ["#fb7185", "#fda4af", "#fecdd3"],
        emoji: "🎂"
    },
    {
        id: "anniversary",
        name: "Anniversary",
        category: "celebration",
        frontText: "Happy Anniversary",
        insidePrompt: "Celebrate your journey together",
        colors: ["#e11d48", "#f43f5e", "#fb7185"],
        emoji: "💕"
    },
    {
        id: "apology",
        name: "I'm Sorry",
        category: "apology",
        frontText: "I'm Sorry...",
        insidePrompt: "Express sincere apology and love",
        colors: ["#fda4af", "#ffe4e6", "#fff1f2"],
        emoji: "🙏"
    },
    {
        id: "justbecause",
        name: "Just Because",
        category: "love",
        frontText: "Thinking of You",
        insidePrompt: "Share why they're special",
        colors: ["#fb7185", "#fecdd3", "#fff1f2"],
        emoji: "💌"
    },
    {
        id: "valentine",
        name: "Valentine's Day",
        category: "celebration",
        frontText: "Be Mine 💝",
        insidePrompt: "Write a romantic Valentine's message",
        colors: ["#be123c", "#e11d48", "#fb7185"],
        emoji: "💝"
    }
];
