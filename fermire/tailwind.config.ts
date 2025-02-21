import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#007546',
        secondaryColor: '#00D480',
        inputLabelolor: '#D9D9D9',
        bgColor: '#ffffff',
        textColor: '#002718',
        primaryButtonColor: '#00AD1d',
        secondaryButtonColor: '#FF8000',
        primaryButtonHoverColor: '#006B12',
        secondaryButtonHoverColor: '#834100',
        cartBg: '#EFEFEF',
        bgRed: '#DC2626',
        primary: '#007546',
        secondary: '#00D480',   
        muted: '#D9D9D9',            
        background: '#ffffff',       
        foreground: '#002718',      
        primaryButton: '#00AD1d',   
        secondaryButton: '#FF8000', 
        destructive: '#DC2626'
      },
    },
  },
  plugins: [],
} satisfies Config;

// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primaryColor: '#007546',
//         secondaryColor: '#00D480',
//         inputLabelolor: '#D9D9D9',
//         bgColor: '#ffffff',
//         textColor: '#002718',
//         primaryButtonColor: '#00AD1d',
//         secondaryButtonColor: '#FF8000',
//         primaryButtonHoverColor: '#006B12',
//         secondaryButtonHoverColor: '#834100',
//         cartBg: '#EFEFEF',
//         bgRed: '#DC2626',
//         primary: '#007546',          // Previously primaryColor
//         secondary: '#00D480',        // Previously secondaryColor
//         muted: '#D9D9D9',            // Previously inputLabelColor
//         background: '#ffffff',       // Previously bgColor
//         foreground: '#002718',       // Previously textColor
//         primaryButton: '#00AD1d',    // Primary button color
//         secondaryButton: '#FF8000',  // Secondary button color
//         destructive: '#DC2626'
//       },
//       animation: {
//         quantumSpin: 'quantum-spin 2s linear infinite',
//         particleWave: 'particle-wave 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         morph: 'morph 2s ease-in-out infinite',
//         orbital: 'orbital 2s linear infinite',
//         shimmer: 'shimmer 1.5s infinite linear'
//       },
//       keyframes: {
//         'quantum-spin': {
//           from: { transform: 'rotate(0deg)' },
//           to: { transform: 'rotate(360deg)' }
//         },
//         'particle-wave': {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-15px)' }
//         },
//         'morph': {
//           '0%': { 
//             borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
//             transform: 'scale(1)'
//           },
//           '50%': { 
//             borderRadius: '50%',
//             transform: 'scale(0.8)'
//           },
//           '100%': { 
//             borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
//             transform: 'scale(1)'
//           }
//         },
//         'orbital': {
//           from: { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
//           to: { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' }
//         },
//         'shimmer': {
//           '100%': { transform: 'translateX(100%)' }
//         }
//       }
//     },
//   },
//   plugins: [],
// } satisfies Config;

