function main() {
  var campaignIterator = AdWordsApp.campaigns().get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var allTimeStats = campaign.getStatsFor('ALL_TIME');
    var totalSpend = allTimeStats.getCost();

    if (campaign.isEnabled()) {
      if (totalSpend > 100 && totalSpend < 200) {

/*
        var adGroup1 = AdWordsApp.adGroups().withCondition('Name = "Ad Group #1"').get().next();
        // adGroup1.pause();
        // adGroup1.bidding().setCpc(0.1);

        var adGroup2 = AdWordsApp.adGroups().withCondition('Name = "Ad Group #2"').get().next();
        adGroup2.display().newPlacementBuilder().withUrl('http://espn.com').build();
        adGroup2.display().newPlacementBuilder().withUrl('http://bleacherreport.com').build();
        adGroup2.display().newPlacementBuilder().withUrl('http://cbssports.com').build();
        adGroup2.display().newPlacementBuilder().withUrl('http://foxsports.com').build();
        adGroup2.display().newPlacementBuilder().withUrl('http://si.com').build();
*/

      } else if (totalSpend > 200 && totalSpend < 400) {
        campaign.getBudget().setAmount(100);
      } else if (totalSpend > 400 && totalSpend < 800) {
        campaign.getBudget().setAmount(200);
      } else if (totalSpend > 800) {
        campaign.getBudget().setAmount(300);
      }
    }
  }
}
