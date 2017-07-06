var $ = document.getElementById.bind(document);

var url = 'https://rust.facepunch.com/commits/123';

$('name').textContent = chrome.i18n.getMessage('name');
$('link').href = url;
$('remove').onclick = function() {
  chrome.management.uninstallSelf({showConfirmDialog: true});
  window.close();
};
