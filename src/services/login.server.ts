import * as server_config from '../configs/'

export class LoginService {
  static initUserId(
    deviceID: string,
    devicePlatform: string,
    userCount: number,
    hasUnderScore = false
  ) {
    const temp_user_id: string =
      deviceID.slice(0, 16) +
      devicePlatform[0] +
      server_config.characters[
        Math.floor(Math.random() * server_config.characters.length)
      ] +
      server_config.cnt_to_char[userCount] +
      server_config.characters[
        Math.floor(Math.random() * server_config.characters.length)
      ];

    let userID = temp_user_id
      .split("")
      .map((char) => {
        return server_config.lookup_tab[char];
      })
      .join("");
    return hasUnderScore ? `_${userID}` : userID;
  }
}
