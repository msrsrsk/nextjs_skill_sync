import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: 'var(--main)',
			tag: {
				default: 'var(--tag-active)',
				updates: 'var(--tag-updates)',
				voices: 'var(--tag-voices)',
				extras: 'var(--tag-extras)',
			},
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			error: 'var(--error)',
			sub: 'var(--sub)',
			blur: 'var(--blur)',
			card: 'var(--card)',
			mask: 'var(--mask)',
			overlay: 'rgba(var(--overlay-rgba))',
			
			'soft-white': 'var(--soft-white)',
			'form-line': 'var(--form-line)',
			'form-bg': 'var(--form-bg)',
			
			'grass-no-gradient': 'rgba(var(--grass-no-gradient-rgba))',
  		},
  		fontFamily: {
			nasalization: [
				'var(--font-nasalization)'
			],
  			poppins: [
  				'var(--font-poppins)'
  			],
			zen: [
				'var(--font-zen-kaku-gothic-new)'
			]
  		},
		maxWidth: {
			'xs': 'var(--container-xs)',
			'sm': 'var(--container-sm)',
			'md': 'var(--container-md)',
			'md-lg': 'var(--container-md-lg)',
			'lg': 'var(--container-lg)',
			'xl': 'var(--container-xl)',
			'2xl': 'var(--container-2xl)',
			'3xl': 'var(--container-3xl)',
			'4xl': 'var(--container-4xl)',
		},
		screens: {
			'sm-md': '480px',
			'md-lg': '960px',
			'md-2lg': '1200px',
			'lg-xl': '1440px',
			'xl-2xl': '1800px',
		},
		dropShadow: {
  			"main": "0 56px 24px rgba(var(--shadow-rgba))",
			"soft": "0 24px 24px rgba(var(--shadow-rgba))",
			"main-sp": "0 40px 24px rgba(var(--shadow-rgba))",
			"soft-sp": "0 16px 16px rgba(var(--shadow-rgba))",
			"light": "0 24px 24px rgba(var(--shadow-rgba))",
			"cart": "0 4px 4px rgba(0,0,0,0.25)",
			"toast": "0 12px 24px rgba(var(--shadow-rgba))",
			"toast-sp": "0 8px 24px rgba(var(--shadow-rgba))",
  		},
		boxShadow: {
			"main": "0 0 0 1.5px rgba(var(--main-rgb), 0.8)",
			"footer-sp": "0 -40px 24px 0 rgb(var(--footer-shadow-rgb))",
			"footer": "0 -56px 32px 0 rgb(var(--footer-shadow-rgb))"
		},
		backgroundImage: {
			'grass': 'linear-gradient(118.13deg, rgba(var(--white-rgb),0.9) 0%, rgba(var(--white-rgb),0.4) 100%);',
			'top-gradient': 'linear-gradient(to top, rgba(var(--bg-rgb),0) 0%, rgba(var(--bg-rgb),1) 100%)',
			'bottom-gradient': 'linear-gradient(to bottom, rgba(var(--bg-rgb),0) 0%, rgba(var(--bg-rgb),1) 100%)',
			'slider-btn-left': 'linear-gradient(to left, rgba(var(--bg-rgb),0) 0%, rgba(var(--bg-rgb),0.6) 50%, rgba(var(--bg-rgb),1.0) 100%);',
			'slider-btn-right': 'linear-gradient(to right, rgba(var(--bg-rgb),0) 0%, rgba(var(--bg-rgb),0.6) 50%, rgba(var(--bg-rgb),1.0) 100%);',
			'trend-status': 'linear-gradient(45deg, rgba(var(--tag-active-rgb),1.0) 0%, rgba(var(--tag-active-rgb),0.6) 100%);',
			'random-gradient': 'linear-gradient(135deg, rgba(255, 77, 77, 1) 0%, rgba(240, 112, 61, 1) 25%, rgba(220, 185, 71, 1) 50%, rgba(57, 204, 111, 1) 75%, rgba(63, 172, 239, 1) 100%)',
		},
  		borderRadius: {
  			'2xl': 'calc(var(--radius) + 40px)',
  			'xl': 'calc(var(--radius) + 32px)',
  			'lg': 'calc(var(--radius) + 16px)',
  			'md': 'calc(var(--radius) + 8px)',
  			'sm': 'var(--radius)'
  		},
		keyframes: {
			'floating-anim': {
			  '0%, 100%': { transform: 'translateY(8px)' },
			  '50%': { transform: 'translateY(-8px)' }
			},
			moveHorizontal: {
				"0%": {
				  transform: "translateX(-50%) translateY(-10%)",
				},
				"50%": {
				  transform: "translateX(50%) translateY(10%)",
				},
				"100%": {
				  transform: "translateX(-50%) translateY(-10%)",
				},
			},
			moveInCircle: {
				"0%": {
				  transform: "rotate(0deg)",
				},
				"50%": {
				  transform: "rotate(180deg)",
				},
				"100%": {
				  transform: "rotate(360deg)",
				},
			},
			moveVertical: {
				"0%": {
				  transform: "translateY(-50%)",
				},
				"50%": {
				  transform: "translateY(50%)",
				},
				"100%": {
				  transform: "translateY(-50%)",
				},
			},
			ripple: {
				"0%": {
					boxShadow: "0 0 0 0 rgb(var(--btn-hover-rgb), 100%)"
				},
				"70%": {
					boxShadow: "0 0 0 10px rgb(var(--btn-hover-rgb), 0%)"
				},
				"100%": {
					boxShadow: "0 0 0 0 rgb(var(--btn-hover-rgb), 0%)"
				}
			},
			trendAnim: {
				'0%': {
				  transform: 'scale(0.6, 0.6)',
				  opacity: '1'
				},
				'50%': {
				  transform: 'scale(1.08, 1.08)',
				  opacity: '0.4'
				},
				'100%': {
				  transform: 'scale(1.12, 1.12)',
				  opacity: '0'
				}
			},
			maskFill: {
				'0%': {
					clipPath: 'inset(0 100% 0 0)'
				},
				'100%': {
					clipPath: 'inset(0 0 0 0)'
				}
			},
		},
		animation: {
			floating: 'floating-anim 2.5s infinite',
			first: "moveVertical 30s ease infinite",
			second: "moveInCircle 20s reverse infinite",
			third: "moveInCircle 40s linear infinite",
			fourth: "moveHorizontal 40s ease infinite",
			fifth: "moveInCircle 20s ease infinite",
			ripple: "ripple 1.5s infinite",
			trend: 'trendAnim 1s ease-out infinite',
			mask: 'maskFill 2s ease-in-out',
		}
  	}
  },
//   plugins: [require("tailwindcss-animate")],
};
export default config;