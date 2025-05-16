
import type { Config } from "tailwindcss";

export default {
	
	// darkMode: ["class"],
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Poppins', 'sans-serif']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				decagon: {
					primary: '#4AE3B5', // New primary color - green from logo
					secondary: '#22D3EE', // New secondary color - cyan from logo
					accent: '#FF7262', // Warm coral accent
					light: '#F9FAFF', // Slightly warmer light background
					dark: '#1A1A2E', // Deeper navy dark
					cream: '#F8F9FA', // Light cream
					muted: '#94A3B8', // Muted color
					purple: '#9b87f5', // Added purple color from the website
					blue: '#3B82F6', // Brighter blue
					pink: '#EC4899', // Vibrant pink
					futuristic: '#22D3EE', // Updated futuristic cyan
					neon: '#4AE3B5', // Updated neon green
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-reverse': {
					'0%, 100%': { transform: 'translateY(-5px)' },
					'50%': { transform: 'translateY(5px)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'marquee': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 15px 0 rgba(121, 40, 202, 0.7)' 
					},
					'50%': { 
						boxShadow: '0 0 25px 5px rgba(0, 240, 255, 0.8)' 
					}
				},
				'text-gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'100%': { backgroundPosition: '100% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float-slow': 'float 6s ease-in-out infinite',
				'float-medium': 'float 5s ease-in-out infinite',
				'float-fast': 'float 4s ease-in-out infinite',
				'float-reverse': 'float-reverse 5s ease-in-out infinite',
				'fade-in': 'fade-in 0.75s ease-in-out forwards',
				'fade-out': 'fade-out 0.75s ease-in-out forwards',
				'fade-in-delay-1': 'fade-in 0.75s ease-in-out 0.3s forwards',
				'fade-in-delay-2': 'fade-in 0.75s ease-in-out 0.6s forwards',
				'fade-in-delay-3': 'fade-in 0.75s ease-in-out 0.9s forwards',
				'marquee': 'marquee 25s linear infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'text-gradient-shift': 'text-gradient-shift 4s ease infinite alternate'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-gradient': 'linear-gradient(135deg, #5D5FEF 0%, #50E3C2 100%)',
				'secondary-gradient': 'linear-gradient(90deg, #FF7262 0%, #FFB86C 100%)',
				'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
				'futuristic-gradient': 'linear-gradient(135deg, #7928CA 0%, #00F0FF 100%)'
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;