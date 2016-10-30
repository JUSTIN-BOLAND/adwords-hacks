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

  var sid = 'XXXX'; // Twilio Account SID
  var auth = 'XXXX'; // Twilio Auth Token
  var client = new Twilio(sid,auth);


  var campaignIterator = AdWordsApp.campaigns().get();
  // var campaignIterator = AdWordsApp.campaigns().withIds([12345]).get(); // select specific campaigns

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor('TODAY');
    var conversion_value = 150;

    var spend = stats.getCost();
    var revenue = stats.getConvertedClicks() * conversion_value;
    var loss = spend - revenue;

    if (loss > 200 && campaign.isEnabled()) { // daily loss threshold
      campaign.pause();
      var message = AdWordsApp.currentAccount().getName() + ' - Paused Campaign: ' + campaign.getName();
      client.sendMessage('+16191234567', '+16191234567', message); // Twilio phone numbers
    }
  }
}
