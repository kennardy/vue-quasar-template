import JwtDecode from 'jwt-decode'

export type TokensRaw = {
  access: string | null
  refresh: string | null
}

type JwtData = {
  exp: number
  [key: string]: any
}

export class BaseAuthenticationTokens {
  access: string | null
  refresh: string | null
  constructor(access: string | null, refresh: string | null) {
    this.access = access && this._tokenIsValid(access) ? access : null
    this.refresh = refresh && this._tokenIsValid(refresh) ? refresh : null
    if (this.access) {
      localStorage.setItem('access', this.access)
    }
    if (this.refresh) {
      localStorage.setItem('refresh', this.refresh)
    }
  }

  static getFromStorage(): BaseAuthenticationTokens {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    return new BaseAuthenticationTokens(access, refresh)
  }

  removeTokens(): void {
    this.removeRefresh()
    this.removeAccess()
  }

  removeAccess(): void {
    localStorage.removeItem('access')
    this.access = null
  }

  removeRefresh(): void {
    localStorage.removeItem('refresh')
    this.refresh = null
  }

  get accessIsValid(): boolean {
    return this._tokenIsValid(this.access)
  }

  get refreshIsValid(): boolean {
    return this._tokenIsValid(this.refresh)
  }

  private _tokenIsValid(token: string | null): boolean {
    if (!token) return false
    const currentDate = (Date.now() / 1000) | 0
    try {
      const data = this._parseJwt(token)
      return currentDate < data.exp
    } catch (e) {
      return false
    }
  }

  private _parseJwt(token: string): JwtData {
    return JwtDecode<JwtData>(token)
  }
}
