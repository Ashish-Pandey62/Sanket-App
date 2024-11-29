/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./providers/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: "#B28CFF",
          secondary: "#BFA4E7",
          bg_white: "#F0F0F0"
      },
      fontFamily: {
        caveatBold: ["Caveat-Bold", "sans-serif"],
        caveatMedium: ["Caveat-Medium", "sans-serif"],
        caveatRegular: ["Caveat-Regular", "sans-serif"],
        caveatSemibold: ["Caveat-SemiBold", "sans-serif"],
      },
    },
    plugins: [],
  }
}