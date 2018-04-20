//const config = require('./config.json');
import fetch from 'dva/fetch';

const data = require('./data')
const config = data.configs
const tokensIcons = require('./tokens_icons.json');

let tokens = config.tokens || []
tokens.forEach(token=>{
  token.icon = tokensIcons[token.symbol]
});
const markets = config.markets
const txs = config.txs;
const projects =  data.projects;

// mock some tokens's data read from localstorage
const localTokens = [];
tokens = tokens.concat(localTokens)

function requestWhiteList() {
  const url = "//raw.githubusercontent.com/Loopring/mock-relay-data/master/whiteList.json";
  return fetch(url, {method:'GET'}).then((res) => res.json())
}

async function  isinWhiteList(address) {
 return await requestWhiteList().then(whiteList =>{
    console.log('WhiteList:', JSON.stringify(whiteList));
    const result = whiteList.find(add => add.toLowerCase() === address.toLowerCase());
    return !!result;
  });
}

function getChainId(){
  return config.chainId

}

function getTokenBySymbol(symbol){
  if(!symbol){ return {} }
  return tokens.find(token=>token.symbol.toLowerCase()===symbol.toLowerCase()) || {}
}

function getTokenByAddress(address){
  if(!address){ return {} }
  return tokens.find(token=>token.address.toLowerCase()===address.toLowerCase())
}

function getCustomTokens(){
  return tokens.filter(token=>token.custom)
}

function getTokens(){
  return tokens
}

function getMarketByPair(pair) {
  if (pair) {
    const pairArr = pair.split('-')
    if(pairArr && pairArr.length === 2) {
      return getMarketBySymbol(pairArr[0], pairArr[1])
    }
  }
}

function getProjectByName(name) {
  if(!name){return {}}
 return  projects.find(project=> project.name.toLowerCase() === name.toLowerCase())
}

function getProjectById(id) {
  if(!id){return {}}
  return projects.find(project=> project.projectId === id)
}
function getProjectByLrx(lrx) {
  if(!lrx){return {}}
  return  projects.find(project=> project.lrx.toLowerCase() === lrx.toLowerCase())
}

function getSupportedMarketsTokenR() {
  return config.supportedTokenRInMarkets
}

function isSupportedMarket(market) {
  if(!market) return false
  const pair = market.split('-')
  if(pair.length != 2) return false
  return markets.find(m=> {
    return (m.tokenx === pair[0].toUpperCase() && m.tokeny === pair[1].toUpperCase()) || (m.tokenx === pair[1].toUpperCase() && m.tokeny === pair[0].toUpperCase())
  })
}

function getMarketBySymbol(tokenx, tokeny) {
  if (tokenx && tokeny) {
    return markets.find(market=> {
        return (market.tokenx === tokenx && market.tokeny === tokeny) || (market.tokenx === tokeny && market.tokeny === tokenx)
      }
    ) || {
      "pricePrecision": 8
    }
  }else{
    return {
      "pricePrecision": 8
    }
  }
}

function getMarketsByTokenR(token) {
  return config.markets.filter(item=>item.tokeny === token)
}

function getTokenSupportedMarket(token) {
  const supportedToken = getSupportedMarketsTokenR()
  let foundMarket = ''
  if(supportedToken) {
    if(supportedToken.includes(token)) {
      const markets = getMarketsByTokenR(token)
      if(markets) {
        foundMarket = markets[0].tokenx + "-" + markets[0].tokeny
      }
    } else {
      const tokenR = supportedToken.find((x,i) =>{
        const market = token + "-" + x
        if(isSupportedMarket(market)) {
          return true
        }
      })
      if(tokenR) foundMarket = token + "-" + tokenR
    }
  }
  return foundMarket
}
function getMarkets() {
  return markets;
}

function getGasLimitByType(type) {
  if(type){
    return txs.find(tx => type === tx.type)
  }

}

function getWalletAddress() {
  return config.walletAddress
}

function getDelegateAddress() {
  return config.delegateAddress;
}


export default {
  getTokenBySymbol,
  getTokenByAddress,
  getTokens,
  getMarketBySymbol,
  getMarketByPair,
  getProjectByName,
  getProjectById,
  getProjectByLrx,
  getGasLimitByType,
  isinWhiteList,
  getChainId,
  isSupportedMarket,
  getSupportedMarketsTokenR,
  getMarketsByTokenR,
  getTokenSupportedMarket,
  getMarkets,
  getWalletAddress,
  getDelegateAddress
}
