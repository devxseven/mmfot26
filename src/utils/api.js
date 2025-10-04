// src/utils/api.js
import { decryptObject } from './encryption';
import games from '../assets/games.json';
import channels from '../assets/channels.json';

const ENCRYPTION_KEY = import.meta.env.VITE_GITHUB_OWNER;
const FILE_NAME = "matches.json";
const FILE_PATH = "mdata";
const ACC_NAME = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_TOKEN_FIRST = import.meta.env.VITE_GITHUB_TOKEN_FIRST; // First part of the token
const GITHUB_TOKEN_SECOND = import.meta.env.VITE_GITHUB_TOKEN_SECOND; // Second part of the token

export const fetchMatches = async () => {
    try {
        // First try with GitHub API key
        try {
            const key = GITHUB_TOKEN_FIRST;
            const defaultValue = GITHUB_TOKEN_SECOND;
            return await fetchMatchesWithKey(key, defaultValue);
        } catch (error) {
            console.warn('Fetch with key failed, trying without key:', error);
            // Fallback to raw GitHub URL
            const response = await fetch(`https://raw.githubusercontent.com/${ACC_NAME}/${FILE_PATH}/refs/heads/main/${FILE_NAME}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const encryptedData = await response.json();
            const decryptedData = decryptObject(encryptedData, ENCRYPTION_KEY);
            return decryptedData.context || [];
        }
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
};

const fetchMatchesWithKey = async (key, value) => {
    const url = `https://api.github.com/repos/${ACC_NAME}/${FILE_PATH}/contents/${FILE_NAME}`;
    const response = await fetch(url, {
        headers: {
            "Authorization": `token ${key}${value}`,
            "User-Agent": "GitHub-Admin-Panel"
        }
    });
    const data = await response.json();
    const content = JSON.parse(atob(data.content));
    const decryptedData = decryptObject(content, ENCRYPTION_KEY);
    return decryptedData.context || [];
};

export const fetchChannels = async () => {
    try {
        return channels;
    } catch (error) {
        console.error('Error fetching channels:', error);
        return [];
    }
};

export const fetchGames = async () => {
    try {
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
};