import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                "pastel-white": "#FFFDF9",
                "pastel-white-alt": "#FDFDF5",
                "pastel-lavender": "#E6E6FA",
                "pastel-yellow": "#FFF9C4",
                "pastel-blue": "#AEDFF7",
                "pastel-blue-dark": "#7AC7F4",
                "pastel-green": "#B2C8B2",
                "pastel-green-dark": "#94B89C",
                "pastel-red": "#FADADD",
                "pastel-red-dark": "#F7C7C7",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
