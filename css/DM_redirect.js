function DM_redirect(MobileURL, Home){
	try {
		// avoid loops within mobile site
		if(document.getElementById("dmRoot") != null)
		{
			return;
		}
		var CurrentUrl = location.href
		var noredirect = document.location.search;
		if (noredirect.indexOf("no_redirect=true") < 0){
			if (screen.width <= 769) {
				if(Home){
					location.replace(MobileURL);
				}
				else
				{
					location.replace(MobileURL + "?url=" + encodeURIComponent(CurrentUrl));
				}
			}
		}	
	}
	catch(err){}
}