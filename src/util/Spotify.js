const clientId = '05e6a527b9ab4c1c9b35e43e305fdb1e';
const redirect = 'http://localhost:3000/';

const authURL = 'https://accounts.spotify.com/authorize';
let accessToken;
const Spotify = {
  getAccessToken(){
    if (!accessToken){
      const url = window.location.href;
      const accessTokenCode = url.match(/access_token=([^&]*)/);
      const expireTimeCode = url.match(/expires_in=([^&]*)/);

      if(accessTokenCode && expireTimeCode) {
        accessToken = accessTokenCode;
        let expiration = expireTimeCode;

        window.setTimeout(() => accessToken = '',expiration * 1000);
        window.history.pushState('Access Token',null,'/');
      } else {
        window.location.href = `${authURL}?client_id=&${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`
      }
      return accessToken;
    }
  },
  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${Spotify.getAccessToken()}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.searchResults) {
        return jsonResponse.searchResults.map(track => ({
          Id: track.id,
          Name: track.name,
          Artist: track.artist[0].name,
          Album: track.album.name,
          URI: track.uri
        }));
      }
    });
  },
  savePlayList(name,trackURIs){
    if(!name || !trackURIs){
      return;
    }

  }
};

export default Spotify;
