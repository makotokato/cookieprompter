const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

function CookiePromptService() {
}

CookiePromptService.prototype = {
  cookieDialog: function (aParent, aCookie, aHostname, aCookieFromHost,
                          aChangingCookie, aRememberDecision) {
    aRememberDecision.value = false;
    let selectStrings = ["Deny",
                         "Allow",
                         "Allow for Session"];
    let state = {};

    if (Services.prompt.select(aParent,
                               "Confirm settings cookie",
                               "",
                               selectStrings.length,
                               selectStrings,
                               state)) {
      return state.value;
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
  if (aReason == APP_SHUTDOWN)
    return;

  UnregisterComponents();
}

function install(aData, aReason)
{
}

function uninstall(aData, aReason)
{
}
