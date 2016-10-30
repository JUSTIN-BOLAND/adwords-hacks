function main() {
  var campaignIterator = AdWordsApp.campaigns().get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();

    // Activate all paused campaigns
    if (campaign.isPaused()) {
      campaign.enable();
    }
  }
}
