OBJS = \
  install.rdf \
  chrome.manifest \
  bootstrap.js \
  chrome/content/settings.xul \
  $(NULL)

XPI = cookie.xpi

$(XPI): $(OBJS)
	zip -R $@ $(OBJS)
