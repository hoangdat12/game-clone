import { LINK_FAILED, NOT_FOUND, PERMISSION_REQ, SERVER_ERROR, USER_NOT_FOUND } from "./constants";

export class CustomError extends Error  {
    readonly status: number;
    readonly code :string;

    constructor(status: number, code: string, message: string | undefined) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export class INTERNAL_SERVER_ERROR extends CustomError {
    constructor(message?: string) {
        super(500, SERVER_ERROR, message)
    }
}

export class NOT_FOUND_ERROR extends CustomError {
    constructor(message?: string) {
        super(404, NOT_FOUND, message)
    }
}

export class USER_NOT_FOUND_ERROR extends CustomError {
    constructor(message?: string) {
        super(404, USER_NOT_FOUND, message)
    }
}

export class LINK_FAIL_ERROR extends CustomError {
    constructor(message?: string) {
        super(404, LINK_FAILED, message)
    }
}

export class NOT_PERMISSION extends CustomError {
    constructor(message?: string) {
        super(403, PERMISSION_REQ, message);
    }
}