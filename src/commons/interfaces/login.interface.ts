export interface LoginDeviceReq {
    // Device Id
    did: string,
    // Platform
    plf: string,
    //Language
    lan: string
}

export interface LoginLinkReq {
    // Link type
    ltp: string;
    // Link Id
    lid: string;
  };