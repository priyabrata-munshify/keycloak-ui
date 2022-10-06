/* eslint-disable no-var */
// @ts-nocheck

import { useEffect } from "react";
import { useWhoAmI } from "../context/whoami/WhoAmI";
import type Keycloak from "keycloak-js";

function ChatwootWidget({ keycloak }: { keycloak: Keycloak }) {
  const { whoAmI } = useWhoAmI();

  useEffect(() => {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right", // This can be left or right
      locale: "en", // Language to be set
      type: "standard", // [standard, expanded_bubble]
    };

    // Paste the script from inbox settings except the <script> tag
    (function (d, t) {
      var BASE_URL = "https://app.chatwoot.com";
      var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        window.chatwootSDK.run({
          websiteToken: "S8t3eGYFdUrstXcfo257v1Ph",
          baseUrl: BASE_URL,
        });
      };
    })(document, "script");
  }, []);

  useEffect(() => {
    const {
      tokenParsed: { email },
    } = keycloak;
    if (whoAmI.me) {
      window.$chatwoot.setUser(whoAmI.getUserId(), {
        name: whoAmI.getDisplayName(),
        email,
      });
      window.$chatwoot.setCustomAttributes({
        locale: whoAmI.getLocale(),
        realm: whoAmI.getRealm(),
      });
    }
  }, [keycloak]);

  return null;
}

export default ChatwootWidget;
