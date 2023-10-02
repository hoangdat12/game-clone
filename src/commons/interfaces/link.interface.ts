export interface CreateLinkReq {
    uid: string,
    ltp: string,
    lid: string
}

export interface DelLinkReq extends CreateLinkReq{}
