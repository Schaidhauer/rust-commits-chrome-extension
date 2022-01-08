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
      message: '#'+svn+' \n'+txt,
      buttons: [{ title: 'More' }],
      isClickable: true,
      priority: 2,
    }, function() {});
  });
}

function openWarningPage() {
  chrome.tabs.create({
    url: 'https://commits.facepunch.com/r/rust_reboot'
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

var lastCommitId = '';

function go(){

	
	
	getCommits();
	
	interval(function(){
		
		getCommits();
	}, 30000, 9999);

}


function getCommits() {
	
        console.log("getCommits");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://commits.facepunch.com/r/rust_reboot', true);
		
		xhr.onload = function(e) {
			
			var tempDom = $('<output>').append($.parseHTML(this.response));
			//console.log(tempDom[0]);

			$( ".commit",tempDom).each(function() {
				var commitId = $( this ).attr('like-id');
				var commmitText = $( this ).children().last().children().eq(1).children().text();
				var commmitAuthor = $( this ).children().find('.author').children().last().text();


				if (commitId != lastCommitId)
				{
					//update last commitId
					lastCommitId = commitId;
					showWarning(commmitAuthor,commitId,commmitText);
				}


				return false;
			});


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


