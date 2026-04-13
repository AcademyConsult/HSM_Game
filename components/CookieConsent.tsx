"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

const GA_MEASUREMENT_ID = "G-WRQ40RMZZC";

export default function CookieConsentComponent() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(..._args: any[]) {
      window.dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    function updateGtagConsent() {
      gtag("consent", "update", {
        analytics_storage: CookieConsent.acceptedCategory("analytics")
          ? "granted"
          : "denied",
      });
    }

    function loadGtagScript() {
      if (document.getElementById("gtag-script")) return;
      const script = document.createElement("script");
      script.id = "gtag-script";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);
    }

    CookieConsent.run({
      mode: "opt-in",

      cookie: {
        name: "cc_cookie",
        expiresAfterDays: 182,
      },

      guiOptions: {
        consentModal: {
          layout: "cloud inline",
          position: "bottom center",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },

      onFirstConsent: () => {
        updateGtagConsent();
        if (CookieConsent.acceptedCategory("analytics")) {
          loadGtagScript();
        }
      },

      onConsent: () => {
        updateGtagConsent();
        if (CookieConsent.acceptedCategory("analytics")) {
          loadGtagScript();
        }
      },

      onChange: ({ changedCategories }) => {
        updateGtagConsent();
        if (
          changedCategories.includes("analytics") &&
          CookieConsent.acceptedCategory("analytics")
        ) {
          loadGtagScript();
        }
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          },
          services: {
            ga: {
              label: "Google Analytics",
              onAccept: () => loadGtagScript(),
              onReject: () => {},
            },
          },
        },
      },

      language: {
        default: "de",
        translations: {
          de: {
            consentModal: {
              title: "Wir verwenden Cookies",
              description:
                'Diese Website verwendet notwendige Cookies, um ihren ordnungsgem\u00e4\u00dfen Betrieb zu gew\u00e4hrleisten, sowie Analyse-Cookies, um zu verstehen, wie Sie mit ihr interagieren. Letztere werden nur nach Ihrer ausdr\u00fccklichen Zustimmung gesetzt. <a href="https://ac-event.notion.site/" data-cc="c-settings">Datenschutzerkl\u00e4rung</a>',
              acceptAllBtn: "Alle akzeptieren",
              acceptNecessaryBtn: "Alle ablehnen",
              showPreferencesBtn: "Einstellungen verwalten",
            },
            preferencesModal: {
              title: "Cookie-Einstellungen",
              acceptAllBtn: "Alle akzeptieren",
              acceptNecessaryBtn: "Alle ablehnen",
              savePreferencesBtn: "Auswahl speichern",
              closeIconLabel: "Schlie\u00dfen",
              serviceCounterLabel: "Dienst|Dienste",
              sections: [
                {
                  title: "Ihre Datenschutzeinstellungen",
                  description:
                    "In diesem Bereich k\u00f6nnen Sie Ihre Pr\u00e4ferenzen zur Verarbeitung Ihrer personenbezogenen Daten festlegen. Sie k\u00f6nnen Ihre Auswahl jederzeit \u00e4ndern, indem Sie dieses Fenster \u00fcber den entsprechenden Link erneut aufrufen.",
                },
                {
                  title: "Technisch notwendige Cookies",
                  description:
                    "Diese Cookies sind f\u00fcr die grundlegende Funktionalit\u00e4t der Website erforderlich und k\u00f6nnen nicht deaktiviert werden.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analyse & Statistik",
                  description:
                    "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren. Alle Daten werden anonymisiert erhoben.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    caption: "Cookie-\u00dcbersicht",
                    headers: {
                      name: "Name",
                      domain: "Dienst",
                      description: "Beschreibung",
                      expiration: "Ablauf",
                    },
                    body: [
                      {
                        name: "_ga",
                        domain: "Google Analytics",
                        description:
                          "Wird von Google Analytics zur Unterscheidung einzelner Nutzer verwendet.",
                        expiration: "2 Jahre",
                      },
                      {
                        name: "_gid",
                        domain: "Google Analytics",
                        description:
                          "Wird von Google Analytics zur Unterscheidung einzelner Nutzer verwendet.",
                        expiration: "24 Stunden",
                      },
                    ],
                  },
                },
                {
                  title: "Weitere Informationen",
                  description:
                    'F\u00fcr weitere Informationen zu unserer Cookie-Richtlinie besuchen Sie bitte unsere <a href="https://ac-event.notion.site/">Datenschutzerkl\u00e4rung</a>.',
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}
