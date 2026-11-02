/** @type {import('tailwindcss').Config} */
module.exports = {
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        fill: 'rgb(var(--c-fill) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        tx: {
          DEFAULT: 'rgb(var(--c-t2) / <alpha-value>)',
          hi: 'rgb(var(--c-t1) / <alpha-value>)',
          low: 'rgb(var(--c-t3) / <alpha-value>)',
          faint: 'rgb(var(--c-t4) / <alpha-value>)'
        },
        acc: {
          DEFAULT: 'rgb(var(--c-acc) / <alpha-value>)',
          bright: 'rgb(var(--c-accb) / <alpha-value>)',
          soft: 'rgb(var(--c-accs) / <alpha-value>)'
        },
        emer: {
          DEFAULT: 'rgb(var(--c-emer) / <alpha-value>)',
          soft: 'rgb(var(--c-emers) / <alpha-value>)'
        },
        tan: {
          DEFAULT: 'rgb(var(--c-tan) / <alpha-value>)',
          soft: 'rgb(var(--c-tans) / <alpha-value>)'
        },
        amb: {
          DEFAULT: 'rgb(var(--c-amb) / <alpha-value>)',
          soft: 'rgb(var(--c-ambs) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
