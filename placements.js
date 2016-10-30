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
    var placementIterator = campaign.display().placements().forDateRange('TODAY').orderBy('Cost DESC').get();

    while (placementIterator.hasNext()) {
      var placement = placementIterator.next();
      var cost = placement.getStatsFor('TODAY').getCost();
      var conversions = placement.getStatsFor('TODAY').getConvertedClicks();

      if (cost > 100 && conversions == 0 && campaign.isEnabled()) { // placement loss threshold at 0 conversions
        var message = AdWordsApp.currentAccount().getName() + ' - Bad Placement: ' + placement.getUrl();
        client.sendMessage('+16191234567', '+16191234567', message); // Twilio phone numbers
      }
    }
  }
}
