const mockData = {
    guildStats: {
        gold: 1000,
        reputation: 0,
        guildLevel: 1,
    },
    adventurers: [
        { id: 1, name: "Archer", level: 5, status: "Available" },
        { id: 2, name: "Mage", level: 3, status: "On Quest" },
    ],
    quests: [
        {
            id: "1",
            name: "Defend the Village",
            description: "Protect the villagers from incoming attacks.",
            reward: 100,
            duration: 60,
            requirements: {
                minLevel: 1,
                preferredClasses: ["Warrior", "Archer"],
            },
        },
        {
            id: "2",
            name: "Slay the Dragon",
            description: "Defeat the dragon terrorizing the kingdom.",
            reward: 500,
            duration: 120,
            requirements: {
                minLevel: 5,
                preferredClasses: ["Mage", "Warrior"],
            },
        },
    ],
    recruits: [
        { id: "1", name: "Warrior", level: 2 },
        { id: "2", name: "Rogue", level: 4 },
    ],
    treasury: {
        currentGold: 1000,
        totalEarned: 0,
        totalSpent: 0,
    },
    achievements: [
        { id: 1, title: "First Quest", unlocked: false },
        { id: 2, title: "Hire 5 Adventurers", unlocked: false },
    ],
};

export const fetchGuildStats = () => Promise.resolve(mockData.guildStats);
export const fetchAdventurers = () => Promise.resolve(mockData.adventurers);
export const fetchQuests = () => Promise.resolve(mockData.quests);
export const fetchRecruits = () => Promise.resolve(mockData.recruits);
export const fetchTreasury = () => Promise.resolve(mockData.treasury);
export const fetchAchievements = () => Promise.resolve(mockData.achievements);
