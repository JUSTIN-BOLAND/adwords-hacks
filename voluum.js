function main() {
  // http://freeadwordsscripts.com/2014/01/make-calls-and-send-text-messages-to.html
  function Twilio(accountSid, authToken) {
    this.ACCOUNT_SID = accountSid;
    this.AUTH_TOKEN = authToken;
    this.MESSAGES_ENDPOINT = 'https://api.twilio.com/2010-04-01/Accounts/' + this.ACCOUNT_SID + '/Messages.json';
    this.CALLS_ENDPOINT = 'https://api.twilio.com/2010-04-01/Accounts/' + this.ACCOUNT_SID + '/Calls.json';

    this.sendMessage = function(to, from, body) {
      var httpOptions = {
        method : 'POST',
        payload : {
          To: to,
          From: from,
          Body: body
        },
        headers : getBasicAuth(this)
      };
      var resp = UrlFetchApp.fetch(this.MESSAGES_ENDPOINT, httpOptions).getContentText();
      return JSON.parse(resp)['sid'];
    }

    function getBasicAuth(context) {
      return {
        'Authorization' : 'Basic ' + Utilities.base64Encode(context.ACCOUNT_SID + ':' + context.AUTH_TOKEN)
      };
    }
  }

  var sid = 'XXXX', // Twilio Account SID
      auth = 'XXXX', // Twilio Auth Token
      client = new Twilio(sid,auth);


  function Voluum(loginAuth) {
    this.AUTH = loginAuth;
    this.VOLUUM_LOGIN = 'https://security.voluum.com/login';

    var date = new Date();
    var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var tomorrow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1);
    this.VOLUUM_REPORT = 'https://portal.voluum.com/report?from=' + today + 'T00:00:00Z&to=' + tomorrow + 'T00:00:00Z&tz=America%2FLos_Angeles&columns=campaignName&columns=revenue&groupBy=campaign&offset=0&include=active';

    this.token = function() {
      var httpOptions = {
        method : 'GET',
        headers : basicAuth(this)
      };
      var resp = UrlFetchApp.fetch(this.VOLUUM_LOGIN, httpOptions).getContentText();
      return JSON.parse(resp)['token'];
    }

    this.campaigns = function() {
      var token = this.token();
      var httpOptions = {
        method : 'GET',
        headers : { 'cwauth-token' : token }
      };
      var resp = UrlFetchApp.fetch(this.VOLUUM_REPORT, httpOptions).getContentText();
      return JSON.parse(resp)['rows'];
    }

    function basicAuth(context) {
      return {
        'Authorization' : 'Basic ' + context.AUTH
      };
    }
  }

  var loginAuth = "XXXX",
      campaigns = new Voluum(loginAuth).campaigns();


  function voluumCampaign(campaign) {
    for(var i = 0; i < campaigns.length; i++) {
      if (campaigns[i]['campaignName'].search(campaign) > -1) {
        return campaigns[i];
      }
    }
  }

  var campaignIterator = AdWordsApp.campaigns().get();
  //var campaignIterator = AdWordsApp.campaigns().withIds([6.2814894E8]).get(); // select specific campaigns

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor('TODAY');
    var spend = stats.getCost();
    var voluum = voluumCampaign(campaign.getName());

    var conversion_value = 150;
    var conversion_revenue = stats.getConvertedClicks() * conversion_value;
    var loss = (voluum) ? spend - voluum['revenue'] : spend - conversion_revenue;

    // if (loss > 200 && campaign.isEnabled() && campaign.getId() != 6.28168315E8) { // filter out specific campaign

    if (loss > 200 && campaign.isEnabled()) { // daily loss threshold
      campaign.pause();
      var message = AdWordsApp.currentAccount().getName() + ' - Paused Campaign: ' + campaign.getName();
      client.sendMessage('+16191234567', '+16191234567', message); // Twilio phone numbers
    }
  }
}
