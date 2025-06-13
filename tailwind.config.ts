import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
				'sans': ['Avenir', 'Avenir Next', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'display': ['Avenir', 'Avenir Next', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'mono': ['Avenir', 'Avenir Next', 'monospace'],
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
				// Premium gradient colors
				vibeflow: {
					'violet': '#8B5CF6',
					'purple': '#A855F7',
					'blue': '#3B82F6',
					'emerald': '#10B981',
					'dark': '#0F0F23',
					'glass': 'rgba(255, 255, 255, 0.1)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'vibeflow-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 25%, #3B82F6 75%, #10B981 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'magnetic': 'magnetic 0.3s ease-out',
				'fadeInUp': 'fadeInUp 0.8s ease-out',
				'slideInLeft': 'slideInLeft 0.6s ease-out',
				'slideInRight': 'slideInRight 0.6s ease-out',
				'bounceIn': 'bounceIn 0.6s ease-out',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'gradient-flow': 'gradient-flow 4s ease infinite',
				// Enhanced micro-animations for spectacular drag and drop
				'aurora': 'aurora 4s ease-in-out infinite',
				'morphing-border': 'morphingBorder 6s ease-in-out infinite',
				'breathe': 'breathe 3s ease-in-out infinite',
				'cascade-glow': 'cascadeGlow 4s ease-in-out infinite',
				'particle-dance': 'particleDance 3s ease-in-out infinite',
				'ripple-expand': 'rippleExpand 1.5s ease-out infinite',
				'magnetic-pull': 'magneticPull 2s ease-in-out infinite',
				'liquid-flow': 'liquidFlow 8s ease-in-out infinite',
				'energy-pulse': 'energyPulse 3s ease-in-out infinite',
				'icon-morph': 'iconMorph 4s ease-in-out infinite',
				'text-glitch': 'textGlitch 0.5s ease-in-out',
				'hologram': 'hologram 2s ease-in-out infinite',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
					'100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' }
				},
				'gradient-shift': {
					'0%, 100%': { transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' },
					'33%': { transform: 'translateX(-50%) translateY(-50%) rotate(120deg)' },
					'66%': { transform: 'translateX(-50%) translateY(-50%) rotate(240deg)' }
				},
				'magnetic': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				'fadeInUp': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slideInLeft': {
					'0%': { opacity: '0', transform: 'translateX(-50px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slideInRight': {
					'0%': { opacity: '0', transform: 'translateX(50px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'bounceIn': {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'pulseGlow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'gradient-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				// Enhanced micro-animation keyframes for spectacular effects
				'aurora': {
					'0%, 100%': { backgroundPosition: '0% 50%', opacity: '0.6' },
					'50%': { backgroundPosition: '100% 50%', opacity: '0.8' }
				},
				'morphingBorder': {
					'0%, 100%': { borderRadius: '16px', transform: 'rotate(0deg) scale(1)', borderWidth: '2px' },
					'25%': { borderRadius: '32px', transform: 'rotate(1deg) scale(1.02)', borderWidth: '3px' },
					'50%': { borderRadius: '24px', transform: 'rotate(0deg) scale(1.05)', borderWidth: '4px' },
					'75%': { borderRadius: '20px', transform: 'rotate(-1deg) scale(1.02)', borderWidth: '3px' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1) translateY(0px)', filter: 'blur(0px)' },
					'50%': { transform: 'scale(1.1) translateY(-10px)', filter: 'blur(1px)' }
				},
				'cascadeGlow': {
					'0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)' },
					'25%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(59, 130, 246, 0.15)' },
					'50%': { boxShadow: '0 0 60px rgba(16, 185, 129, 0.5), 0 0 80px rgba(59, 130, 246, 0.3), 0 0 100px rgba(139, 92, 246, 0.2), inset 0 0 40px rgba(16, 185, 129, 0.2)' },
					'75%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(16, 185, 129, 0.3), inset 0 0 30px rgba(168, 85, 247, 0.15)' },
					'100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)' }
				},
				'particleDance': {
					'0%, 100%': { transform: 'translateY(0) translateX(0) scale(1) rotate(0deg)', opacity: '0.4' },
					'25%': { transform: 'translateY(-20px) translateX(10px) scale(1.2) rotate(90deg)', opacity: '0.8' },
					'50%': { transform: 'translateY(-10px) translateX(-15px) scale(0.8) rotate(180deg)', opacity: '1' },
					'75%': { transform: 'translateY(-30px) translateX(5px) scale(1.1) rotate(270deg)', opacity: '0.6' }
				},
				'rippleExpand': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'magneticPull': {
					'0%': { transform: 'translateY(0) scale(1)' },
					'50%': { transform: 'translateY(-15px) scale(1.1)' },
					'100%': { transform: 'translateY(0) scale(1)' }
				},
				'liquidFlow': {
					'0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'rotate(0deg) scale(1)' },
					'25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'rotate(90deg) scale(1.1)' },
					'50%': { borderRadius: '70% 30% 40% 60% / 40% 70% 60% 30%', transform: 'rotate(180deg) scale(0.9)' },
					'75%': { borderRadius: '40% 70% 60% 30% / 70% 40% 50% 70%', transform: 'rotate(270deg) scale(1.05)' }
				},
				'energyPulse': {
					'0%, 100%': { background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', transform: 'scale(1)' },
					'33%': { background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.2), rgba(168, 85, 247, 0.2))', transform: 'scale(1.05)' },
					'66%': { background: 'linear-gradient(225deg, rgba(16, 185, 129, 0.4), rgba(168, 85, 247, 0.3), rgba(139, 92, 246, 0.2))', transform: 'scale(1.1)' }
				},
				'iconMorph': {
					'0%, 100%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
					'25%': { transform: 'scale(1.2) rotate(90deg)', filter: 'hue-rotate(90deg)' },
					'50%': { transform: 'scale(0.8) rotate(180deg)', filter: 'hue-rotate(180deg)' },
					'75%': { transform: 'scale(1.1) rotate(270deg)', filter: 'hue-rotate(270deg)' }
				},
				'textGlitch': {
					'0%, 100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
					'20%': { transform: 'translate(-2px, 2px)', filter: 'hue-rotate(90deg)' },
					'40%': { transform: 'translate(-2px, -2px)', filter: 'hue-rotate(180deg)' },
					'60%': { transform: 'translate(2px, 2px)', filter: 'hue-rotate(270deg)' },
					'80%': { transform: 'translate(2px, -2px)', filter: 'hue-rotate(360deg)' }
				},
				'hologram': {
					'0%, 100%': { opacity: '1', backgroundPosition: '0% 0%' },
					'25%': { opacity: '0.8', backgroundPosition: '25% 25%' },
					'50%': { opacity: '0.6', backgroundPosition: '50% 50%' },
					'75%': { opacity: '0.8', backgroundPosition: '75% 75%' }
				}
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
