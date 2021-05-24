// A workaround for the auto-slash host services such as GitHub pages, AWS, Azure Webservice, etc ...
// This code will remove the slash from the url if the host service adds one. More info here:
// https://github.com/h2oai/wave/issues/778#issuecomment-831188177

if (window && window.location && window.location.pathname.endsWith('/') && window.location.pathname !== '/') {
  window.history.replaceState('', '', window.location.pathname.substr(0, window.location.pathname.length - 1) + window.location.hash)
}
