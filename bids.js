function main() {
  var campaignIterator = AdWordsApp.campaigns().get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var allTimeStats = campaign.getStatsFor('ALL_TIME');
    var spend = allTimeStats.getCost();

    if (spend > 125 && campaign.isEnabled()) {
      var todayStats = campaign.getStatsFor('TODAY');
      var position = todayStats.getAveragePosition();

      var adGroup = AdWordsApp.adGroups().withCondition('Name = "Ad Group #2"').get().next();
      var currentBid = adGroup.bidding().getCpc();

      if (adGroup.isEnabled()) {
        if (position > 0 && position < 2) {
          // lower by 0.25
          adGroup.bidding().setCpc(currentBid - 0.25);
        } else if (position >= 2 && position < 3) {
          // max bid 1.5
          if (currentBid > 1.5) {
            adGroup.bidding().setCpc(1.5);
          }
        } else if (position >= 3.5 && position < 4) {
          // max bid 1.5 and increase by 0.25
          if (currentBid > 1.5) {
            adGroup.bidding().setCpc(1.5);
          } else {
            adGroup.bidding().setCpc(currentBid + 0.25);
          }
        } else if (position >= 4) {
          // max bid 1.75 and increase by 0.5
          if (currentBid > 1.75) {
            adGroup.bidding().setCpc(1.75);
          } else {
            adGroup.bidding().setCpc(currentBid + 0.5);
          }
        }
      }
    }
  }
}
