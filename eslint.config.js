module.exports = [
    {
        "files": ["**/*.js"],
        "languageOptions": {
            "ecmaVersion": 2018,
            "globals": {
                "es6": true,
                "node": true,
                "mocha": true
            }
        },
        "rules": {
            "indent": [
                "error",
                "tab",
                {
                    "SwitchCase": 1
                }
            ],
            "no-console": "off",
            "no-var": "error",
            "no-trailing-spaces": "error",
            "prefer-const": "error",
            "quotes": [
                "error",
                "double",
                {
                    "avoidEscape": true,
                    "allowTemplateLiterals": true
                }
            ],
            "semi": [
                "error",
                "always"
            ]
        }
    }  
];