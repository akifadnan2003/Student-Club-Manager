import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'ulu-bg': '#191919',
                'ulu-surface': '#2A2A2A',
                'ulu-blue': '#003399',
                'ulu-gold': '#FFCC00',
                'ulu-red': '#EF4444',
                'ulu-text-primary': '#FFFFFF',
                'ulu-text-secondary': '#A0A0A0',
                'ulu-cyan': '#2299DD', // Keeping for legacy/accents
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
