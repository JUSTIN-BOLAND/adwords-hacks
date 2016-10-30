function main() {
  var campaignIterator = AdWordsApp.campaigns().get();

  // Outputs campaign names and ids
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();

    Logger.log(campaign.getId());
    Logger.log(campaign.getName());
    Logger.log('');
  }
}
