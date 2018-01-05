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
      console.log(url);
      console.log(accessTokenCode);
      console.log(expireTimeCode);
      if(accessTokenCode && expireTimeCode) {
        accessToken = accessTokenCode;
        let expire = expireTimeCode;
//console.log(accessToken);
//console.log(expire);
        window.setTimeout(() => accessToken = '',expire * 1000);
        window.history.pushState('Access Token',null,'/');
      } else {
        window.location.href = `${authURL}?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=playlist-modify-public`
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
        return jsonResponse.searchResults.items.map(track => ({
          ID: track.id,
          Name: track.name,
          Artist: track.artist[0].name,
          Album: track.album.name,
          URI: track.uri
        }));
      }
    });
  },
  savePlayList(playlistName,tracks){
    if(!playlistName || !tracks){
      return;
    }

    let accessToken = Spotify.getAccessToken();
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
    let userId;
    console.log(`name: ${playlistName}; tracks: ${tracks} accessToken: ${accessToken}`);

    if(!userId){
      console.log('Getting user ID!');
      return fetch('https://api.spotify.com/v1/me', {
          headers: headers
      }).then(response => {
                console.log(response);
                return response.json();
            }).then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({name: playlistName})
                }, wrong => {
                    console.log("Whoops! Something went wrong:" + wrong);
                }).then(response => {
                    if(response.ok){
                        return response.json();
                    }
                    console.log(response);
                })
            })
    }
  }
};

export default Spotify;
