var warningId = 'notification.warning';

function hideWarning(done) {
  chrome.notifications.clear(warningId, function() {
    if (done) done();
  });
}

function showWarning(author,svn,txt) {
  hideWarning(function() {
    chrome.notifications.create(warningId, {
      iconUrl: chrome.runtime.getURL('images/icon-48.png'),
      title: author,
      type: 'basic',
      message: svn+' \n'+txt,
      buttons: [{ title: 'More' }],
      isClickable: true,
      priority: 2,
    }, function() {});
  });
}

function openWarningPage() {
  chrome.tabs.create({
    url: 'https://rust.facepunch.com/commits/'
  });
}


function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            //if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            //}
        };
    }(wait, times);

    setTimeout(interv, wait);
};

var totalCommits = 0;

function go(){

	
	
	getCommits();
	
	interval(function(){
		
		getCommits();
	}, 30000, 9999);

}


function getCommits() {
	
        console.log("getCommits");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://rust.facepunch.com/commits/', true);
		
		xhr.onload = function(e) {
			//for debug/test
			//totalCommits = totalCommits -1;
			
			var tempDom = $('<output>').append($.parseHTML(this.response));
			var allCommits = $('.media', tempDom);
			if (totalCommits < allCommits.length){
				//update totalCommits for the new value
				totalCommits = allCommits.length;

				//get last commit
				var lastCommitHTML = allCommits[0].innerHTML;
				var tempDom2 = $('<lastout>').append($.parseHTML(lastCommitHTML));
				var lastCommit = $('small', tempDom2);
				var lastCommitTxt = $('.pre', tempDom2);
				
				var author = lastCommit[0].innerText.toString();
				var svn = lastCommit[1].innerText.toString();
				//var dt = lastCommit[1].innerText.toString();
				var txt = lastCommitTxt[0].innerText.toString();
				
				showWarning(author,svn,txt);
				
			}else{
				//no new commits
			}
			
		};
		
		xhr.send();

	
	
}

//chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });
//chrome.browserAction.setBadgeText({ text: '!' });
chrome.browserAction.onClicked.addListener(openWarningPage);
chrome.notifications.onClicked.addListener(openWarningPage);
chrome.notifications.onButtonClicked.addListener(openWarningPage);

//chrome.notifications.create("getCommits", {periodInMinutes:1});

chrome.runtime.onInstalled.addListener(go);
//chrome.runtime.onInstalled.addListener(showWarning);


