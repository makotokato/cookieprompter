/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

function CookiePromptService() {
}

CookiePromptService.prototype = {
  cookieDialog: function (aParent, aCookie, aHostname, aCookiesFromHost,
                          aChangingCookie, aRememberDecision) {
    aRememberDecision.value = false;

    let bodytext;

    if (aChangingCookie) {
      bodytext = "The site " + aHostname + "wants to modify an existing cookie";
    } else if (aCookiesFromHost > 1) {
      bodytext = "The site " + aHostname + "wants to set another cookie";
    } else if (aCookiesFromHost == 1) {
      bodytext = "The site " + aHostname + "wants to set a second cookie";
    } else {
      bodytext = "The site " + aHostname + "wants to set a cookie";
    }

    let selectStrings = ["Deny",
                         "Deny (Remember Decision)",
                         "Allow",
                         "Allow (Remember Decision)",
                         "Allow for Session",
                         "Allow for Session (Remember Decision)"];
    let state = {};

    if (Services.prompt.select(aParent,
                               "Confirm settings cookie",
                               bodytext,
                               selectStrings.length,
                               selectStrings,
                               state)) {
      if (state.value % 2 == 1) {
          aRememberDecision.value = true;
      }
      return state.value / 2;
    }

    return Ci.nsICookiePromptService.DENY_COOKIE;
  },

  QueryInterface: XPCOMUtils.generateQI([Ci.nsICookiePromptService]),

  classDescription: "cookie dialog for android",
  contractID: "@mozilla.org/embedcomp/cookieprompt-service;1",
  classID: Components.ID("{ae127e4b-7c35-4426-8a9d-9f3d94552e7c}"),
};

var prompt = new CookiePromptService;

var factory = {
  createInstance: function(outer, iid) {
    if (outer)
      throw Cr.NS_ERROR_NO_AGGREGATION;

    return prompt.QueryInterface(iid);
  },
};

function registerComponents()
{

  let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.registerFactory(prompt.classID,
                            prompt.classDescription,
                            prompt.contractID,
                            factory);
};

function UnregisterComponents()
{
  let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.unregisterFactory(prompt.classID, factory);
}


// export functions

function startup(aData, aReason)
{
  registerComponents();
}

function shutdown(aData, aReason)
{
  UnregisterComponents();
}

function install(aData, aReason)
{
}

function uninstall(aData, aReason)
{
}
