"use client";

import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';
import { type CookieConsentConfig } from 'vanilla-cookieconsent';

// Example function to initialize Google Analytics
const initializeGA = () => {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID`; // Replace with your GA ID

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'YOUR_GA_ID'); // Replace with your GA ID
    `;
    
    // Add a custom attribute to easily find and remove the scripts later
    gaScript.setAttribute('data-cc-script', 'analytics');
    inlineScript.setAttribute('data-cc-script', 'analytics');

    document.head.appendChild(gaScript);
    document.head.appendChild(inlineScript);
    console.log("Google Analytics initialized.");
};

// Example function to remove Google Analytics scripts
const removeGA = () => {
    const scripts = document.querySelectorAll('script[data-cc-script="analytics"]');
    scripts.forEach(script => script.remove());
    // Optional: Clear GA cookies if necessary
    console.log("Google Analytics scripts removed.");
};


const config: CookieConsentConfig = {
    // The element where the modal will be appended
    root: "body", 
    
    // Use 'opt-in' mode, which is compliant with GDPR
    mode: 'opt-in', 
    
    // Show the modal automatically if consent is not valid
    autoShow: true, 
    
    // Prevent page interaction until consent is given
    disablePageInteraction: true,

    // The cookie settings
    cookie: {
        name: 'slatkoifino_cookie_consent',
        expiresAfterDays: 365,
    },

    // This is called on the first user interaction
    onFirstConsent: () => {
        console.log('onFirstConsent fired');
        if (CookieConsent.acceptedCategory('analytics')) {
            initializeGA();
        }
    },

    // This is called on every page load and when consent is changed
    onChange: ({ changedCategories }) => {
        console.log('onChange fired');
        // If the 'analytics' category was just accepted
        if (changedCategories.includes('analytics') && CookieConsent.acceptedCategory('analytics')) {
            initializeGA();
        } 
        // If the 'analytics' category was just rejected
        else if (changedCategories.includes('analytics') && !CookieConsent.acceptedCategory('analytics')) {
            removeGA();
        }
    },

    // Define the languages and translations
    language: {
        default: 'hr',
        translations: {
            hr: {
                consentModal: {
                    title: 'Koristimo kolačiće!',
                    description: 'Naša web stranica koristi kolačiće kako bi vam pružila najbolje iskustvo. Klikom na "Prihvati sve", pristajete na korištenje SVIH kolačića. Međutim, možete posjetiti "Postavke kolačića" kako biste dali kontrolirani pristanak. <a href="/politika-privatnosti" target="_blank">Pročitajte našu Politiku privatnosti</a>.',
                    acceptAllBtn: 'Prihvati sve',
                    acceptNecessaryBtn: 'Odbij sve',
                    showPreferencesBtn: 'Postavke kolačića',
                    // You can also add a close button
                    closeIconLabel: 'Zatvori obavijest',
                },
                preferencesModal: {
                    title: 'Postavke privatnosti',
                    acceptAllBtn: 'Prihvati sve',
                    acceptNecessaryBtn: 'Odbij sve',
                    savePreferencesBtn: 'Spremi postavke',
                    closeIconLabel: 'Zatvori postavke',
                    sections: [
                        {
                            title: 'Upotreba kolačića',
                            description: 'Koristimo kolačiće kako bismo poboljšali vaše iskustvo. Neki kolačići su neophodni za osnovne funkcionalnosti, dok nam drugi pomažu analizirati i poboljšati našu stranicu.',
                        },
                        {
                            title: 'Strogo neophodni kolačići <span class="pm__badge">Uvijek aktivni</span>',
                            description: 'Ovi su kolačići neophodni za funkcioniranje web stranice i ne mogu se isključiti. Oni su obično postavljeni kao odgovor na vaše radnje, kao što su postavke privatnosti ili popunjavanje obrazaca.',
                            linkedCategory: 'necessary',
                        },
                        {
                            title: 'Analitički kolačići',
                            description: 'Ovi kolačići nam omogućuju praćenje posjeta i izvora prometa kako bismo mogli mjeriti i poboljšati performanse naše stranice. Pomažu nam da znamo koje su stranice najpopularnije i kako se posjetitelji kreću po stranici.',
                            linkedCategory: 'analytics',
                        },
                         {
                            title: 'Više informacija',
                            description: 'Za sva pitanja u vezi s našom politikom o kolačićima i vašim izborima, molimo <a href="/kontakt">kontaktirajte nas</a>.',
                        }
                    ],
                },
            },
        },
    },

    // Define the categories of cookies
    categories: {
        necessary: {
            enabled: true, // This category is enabled by default
            readOnly: true, // The user cannot disable this category
        },
        analytics: {
            enabled: false, // This category is disabled by default
            readOnly: false, // The user can enable/disable this category
            // Example of auto-clearing cookies when the category is rejected
            autoClear: {
                cookies: [
                    { name: /^_ga/ }, // Regex to match all Google Analytics cookies
                    { name: '_gid' }
                ]
            }
        },
    },
};

export const CookieConsentBanner = () => {
    useEffect(() => {
        // Run the cookie consent script
        // Make sure it runs only once
        if (typeof window !== "undefined" && !document.getElementById('cc-main')) {
            CookieConsent.run(config);
        }
    }, []);

    return null; // This component does not render anything itself
};