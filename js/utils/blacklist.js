// blacklist.js

export function addToBlacklist(url) {
  let blacklist = JSON.parse(localStorage.getItem('blacklist') || '[]');
  if (!blacklist.includes(url)) {
    blacklist.push(url);
    localStorage.setItem('blacklist', JSON.stringify(blacklist));
  }
}

export function filterBlacklistedChannels(channelsList) {
  const blacklist = JSON.parse(localStorage.getItem('blacklist') || '[]');
  return channelsList.filter(channel => !blacklist.includes(channel.url));
}
