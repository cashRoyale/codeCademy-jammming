const clientId = '05e6a527b9ab4c1c9b35e43e305fdb1e';
const redirect = 'http://localhost:3000/';

let accessToken;
const Spotify = {
  getAccessToken(){
    if (accessToken){
      return accessToken;
    }

    const accessTokenCode = window.location.href.match(/access_token=([^&]*)/);
    const expireTimeCode = window.location.href.match(/expires_in=([^&]*)/);

    if(accessTokenCode && expireTimeCode) {
      accessToken = accessTokenCode;
      let expiration = expireTimeCode;

      window.setTimeout(() => accessToken = '',expiration * 1000);
      window.history.pushState('Access Token',null,'/');

      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=&${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`
      window.location.href = url;
    }
  },
  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
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
